// import { createSupabaseWithToken } from "../config/supabaseClient.js";

// const uploadPhoto = async (req, res) => {
//     try {
//         let { categories } = req.body;
//         const files = req.files;
//         const accessToken = req.cookies.access_token;

//         if (accessToken && accessToken.split('.').length === 3) {
//             console.log("Valid JWT format");
//         } else {
//             console.error("Invalid JWT format");
//         }
        
//         const supabase = createSupabaseWithToken(accessToken);

//         if (!categories || !files || files.length === 0) return res.status(400).json({ error: "No files or categories provided" });

//         if (typeof categories === "string") {
//             try {
//                 categories = JSON.parse(categories);
//             } catch (e) {
//                 return res.status(400).json({ error: "Invalid JSON format in categories" });
//             }
//         }
        
//         const { data: user, error: authError } = await supabase.auth.getUser(accessToken);
        
//         if (authError || !user) return res.status(401).json({ error: "Authentication failed."});

//         if (!Array.isArray(categories)) return res.status(400).json({ error: "Categories must be an array" });

//         let uploadedPhotos = [];

//         for (const file of files) {
//             const fileName = file.originalname;

//             const { data: storageData, error: storageError } = await supabase.storage
//                 .from("images")
//                 .upload(fileName, file.buffer, {
//                     contentType: file.mimetype,
//                     upsert: true,
//                 });

//             if (storageError) {
//                 console.error("Storage upload error:", storageError);
//                 throw storageError;
//             }

//             const { data: publicUrlNo, error: publicUrlError } = supabase.storage
//                 .from("images")
//                 .getPublicUrl(fileName);

//             if (publicUrlError) throw publicUrlError;
            
//             const publicUrl = publicUrlNo.publicUrl;

//             const { data: photoData, error: photoError } = await supabase
//                 .from("photos")
//                 .insert([{ url: publicUrl, user_id: user.user.id}])
//                 .select("id")
//                 .single();

//             if (photoError) {
//                 console.error("DB insert error:", photoError);
//                 throw photoError;
//             }

//             uploadedPhotos.push({
//                 photoId: photoData.id,
//                 url: publicUrl
//             });
//         }

//         const { data: categoriesData, error: categoriesError } = await supabase
//             .from("categories")
//             .select("id")
//             .in("name", categories);

//         if (categoriesError) throw categoriesError;

//         if (!categoriesData || categoriesData.length === 0) {
//             return res.status(400).json({ error: "No valid categories found" });
//         }

//         const photoCategoryEntries = uploadedPhotos.flatMap(({ photoId }) =>
//             categoriesData.map(category => ({
//                 photo_id: photoId,
//                 category_id: category.id,
//             }))
//         );

//         const { error: relationError } = await supabase
//             .from("photo_categories")
//             .insert(photoCategoryEntries);

//         if (relationError) throw relationError;
        
//         console.log("Pictures was successfully uploaded");
//         res.json({ success: true, uploadedPhotos, message: "Pictures was successfully uploaded." });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };

// export default uploadPhoto;


import { createSupabaseWithToken } from "../config/supabaseClient.js";
import { v4 as uuidv4 } from "uuid";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

const assignCategoriesToPhotos = async (photoIds, categoryNames, supabase) => {
    const { data: categoriesData, error: categoriesError } = await supabase
        .from("categories")
        .select("id")
        .in("name", categoryNames);

    if (categoriesError) throw new Error(`Error fetching categories: ${categoriesError.message}`);
    if (!categoriesData || categoriesData.length === 0) {
        throw new Error("No valid categories found");
    }

    const entries = photoIds.flatMap(photoId =>
        categoriesData.map(category => ({
            photo_id: photoId,
            category_id: category.id,
        }))
    );

    const { error: relationError } = await supabase
        .from("photo_categories")
        .insert(entries);

    if (relationError) throw new Error(`Error inserting photo-category relations: ${relationError.message}`);
};

const uploadPhoto = async (req, res) => {
    try {
        let { categories } = req.body;
        const files = req.files;
        const accessToken = req.cookies.access_token;

        if (!accessToken) {
            return res.status(401).json({ error: "Access token missing" });
        }

        const supabase = createSupabaseWithToken(accessToken);

        if (!categories || !files || files.length === 0) {
            return res.status(400).json({ error: "No files or categories provided" });
        }

        if (typeof categories === "string") {
            try {
                categories = JSON.parse(categories);
            } catch {
                return res.status(400).json({ error: "Invalid JSON format in categories" });
            }
        }

        if (!Array.isArray(categories)) {
            return res.status(400).json({ error: "Categories must be an array" });
        }

        const { data: user, error: authError } = await supabase.auth.getUser(accessToken);
        if (authError || !user) {
            console.error("Authentication error:", authError?.message);
            return res.status(401).json({ error: "Authentication failed" });
        }

        const uploadedPhotos = await Promise.all(files.map(async (file) => {
            if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
                throw new Error(`File type not allowed: ${file.mimetype}`);
            }

            const uniqueFileName = `${uuidv4()}-${file.originalname}`;

            const { error: storageError } = await supabase.storage
                .from("images")
                .upload(uniqueFileName, file.buffer, {
                    contentType: file.mimetype,
                    upsert: true,
                });

            if (storageError) {
                console.error("Storage upload error:", storageError.message);
                throw new Error(`Storage error for ${file.originalname}: ${storageError.message}`);
            }

            const { data: publicUrlData, error: publicUrlError } = supabase.storage
                .from("images")
                .getPublicUrl(uniqueFileName);

            if (publicUrlError) {
                throw new Error(`Error getting public URL: ${publicUrlError.message}`);
            }

            const publicUrl = publicUrlData.publicUrl;

            const { data: photoData, error: photoError } = await supabase
                .from("photos")
                .insert([{ url: publicUrl, user_id: user.user.id }])
                .select("id")
                .single();

            if (photoError) {
                throw new Error(`Database insert error: ${photoError.message}`);
            }

            return {
                photoId: photoData.id,
                url: publicUrl,
            };
        }));

        const photoIds = uploadedPhotos.map(p => p.photoId);
        await assignCategoriesToPhotos(photoIds, categories, supabase);

        console.log("Pictures successfully uploaded");
        res.json({ success: true, uploadedPhotos, message: "Pictures successfully uploaded." });
    } catch (err) {
        console.error("Upload error:", err.message);
        res.status(500).json({ error: err.message || "Internal server error" });
    }
};

export default uploadPhoto;
