import { supabase } from "../config/supabaseClient.js";

const uploadPhoto = async (req, res) => {
    try {
        let { categories } = req.body;
        const files = req.files; // Use `req.files` as an array

        if (!categories || !files || files.length === 0) {
            return res.status(400).json({ error: "No files or categories provided" });
        }

        // Check if categories are in correct format
        if (typeof categories === "string") {
            try {
                categories = JSON.parse(categories);
            } catch (e) {
                return res.status(400).json({ error: "Invalid JSON format in categories" });
            }
        }

        if (!Array.isArray(categories)) {
            return res.status(400).json({ error: "Categories must be an array" });
        }

        // Upload each file and store the URL in the database
        let uploadedPhotos = [];

        for (const file of files) {
            const fileName = file.originalname;

            const { data: storageData, error: storageError } = await supabase.storage
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

            // Insert photo record into the photos table
            const { data: photoData, error: photoError } = await supabase
                .from("photos")
                .insert([{ url: publicUrl }])
                .select("id")
                .single();

            if (photoError) throw photoError;

            uploadedPhotos.push({
                photoId: photoData.id,
                url: publicUrl
            });
        }

        // Insert photo-category relationships
        const { data: categoriesData, error: categoriesError } = await supabase
            .from("categories")
            .select("id")
            .in("name", categories);

        if (categoriesError) throw categoriesError;

        if (!categoriesData || categoriesData.length === 0) {
            return res.status(400).json({ error: "No valid categories found" });
        }

        const photoCategoryEntries = uploadedPhotos.flatMap(({ photoId }) =>
            categoriesData.map(category => ({
                photo_id: photoId,
                category_id: category.id,
            }))
        );

        const { error: relationError } = await supabase
            .from("photo_categories")
            .insert(photoCategoryEntries);

        if (relationError) throw relationError;

        res.json({ success: true, uploadedPhotos });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export default uploadPhoto;
