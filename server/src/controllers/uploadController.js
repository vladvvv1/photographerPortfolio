import { supabase } from "../config/supabaseClient.js";
import { SUPABASE_URL } from "../config/config.js";

// export const getPhotos = async (tableName) => {
//     if (!tableName) {
//         console.error("No table provided.");
//         return null;
//     }

//     const { data, error } = await supabase.from(tableName).select("*");

//     if (error) {
//         console.error("Error occured while fetching photos:", error.message);
//         return null;
//     }

//     return data;
// };

// export const deletePhoto = async (bucketName, tableName, photoUrl) => {
//     if (!bucketName || !tableName || !photoUrl) {
//         console.error("Missing required parameters for deleting photos.");
//         return;
//     }

//     const photoName = photoUrl.split("/").pop();
//     console.log(`Deleting file from path: ${photoName}`);

//     const { data: bucketData, error: bucketError } = await supabase.storage
//         .from(bucketName)
//         .remove([photoName]);

//     if (bucketError) {
//         console.error(`Error deleting file from storage:`, bucketError.message);
//         return;
//     }

//     const { data: tableData, error: tableError } = await supabase
//         .from(tableName)
//         .delete()
//         .eq("url", photoUrl);

//     if (tableError) {
//         console.error(
//             "Error deleting file url from table:",
//             tableError.message
//         );
//         return;
//     }
//     console.log("File deleted successfully.");
// };

const uploadPhoto = async (req, res) => {
    try {
        let { categories } = req.body;
        const file = req.file;

        if (!categories || !file)
            return res
                .status(400)
                .json({ error: "No file or categories provided" });

        if (typeof categories === "string") {
            try {
                categories = JSON.parse(categories);
            } catch (e) {
                return res
                    .status(400)
                    .json({ error: "Invalid JSON format in categories" });
            }
        }

        if (!Array.isArray(categories)) {
            return res
                .status(400)
                .json({ error: "Categories must be an array" });
        }

        const fileName = req.file.originalname;
        const { data: storageData, error: storageError } =
            await supabase.storage
                .from("images")
                .upload(fileName, file.buffer, {
                    contentType: file.mimetype,
                    upsert: true,
                });
        if (storageError) throw storageError;

        const { data: publicUrlNo, error: publicUrlError } = supabase.storage
            .from("images")
            .getPublicUrl(fileName);
        if (publicUrlError) throw publicUrlError;
        const publicUrl = publicUrlNo.publicUrl;

        const { data: photoData, error: photoError } = await supabase
            .from("photos")
            .insert([{ url: publicUrl }])
            .select("id")
            .single();

        if (photoError) throw photoError;

        const { data: categoriesData, error: categoriesError } = await supabase
            .from("categories")
            .select("id")
            .in("name", categories);

        if (categoriesError) throw categoriesError;

        const photoId = photoData.id;

        const photoCategoryEntries = categoriesData.map((categoryId) => ({
            photo_id: photoId,
            category_id: categoryId.id,
        }));

        console.log("Photo categories entry: ", photoCategoryEntries);

        const { error: relationError } = await supabase
            .from("photo_categories")
            .insert(photoCategoryEntries);

        if (relationError) throw relationError;

        res.json({ success: true, url: publicUrl });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export default uploadPhoto;
