import { supabase } from "../config/supabaseClient.js";

const deletePhoto = async (req, res) => {
    try {
        const { url, category } = req.body;

        
        console.log("Url: ", url);
        console.log("Category: ", category);

        if (!url || !category) {
            return res.status(400).json({ error: "No URL or category provided." });
        }

        const {data: categoryIdFromTable, error: categoryIdFromTableError} = await supabase
            .from("categories")
            .select("id")
            .eq("name", category);

        console.log("\nCategory id: ", categoryIdFromTable);
        if (categoryIdFromTableError) {
            console.error(categoryIdFromTableError);
        }

        const { data: photoData, error: photoDataError } = await supabase
            .from("photos")
            .select("id")
            .eq("url", url)
        console.log("\nPhotos in photos table: ", photoData);

        if (photoDataError || !photoData || photoData.length === 0) {
            console.log("Error finding photo ID:", photoDataError);
            return res.status(404).json({ error: "Photo not found." });
        }

        console.log("Category id from table.id: ", categoryIdFromTable[0].id);
        const {data: categoryPhotos, error: categoryError} = await supabase
            .from("photo_categories")
            .select("photo_id")
            .eq("category_id", categoryIdFromTable[0].id)
            .in("photo_id", photoData.map(p => p.id));

        console.log(`This photo has ${categoryIdFromTable[0].id} id categories: ${categoryPhotos[0].photo_id}`);

        if (categoryError || !categoryPhotos || categoryPhotos.length === 0) {
            console.log("Error finding photo in category: ", categoryError);
            return res.status(404).json({error: "Photo not found in this category."});
        }

        const photoIdToDelete = categoryPhotos[0].photo_id;
        console.log(photoIdToDelete);

        const { data: photoCategoriesTable, error: photoCategoriesTableError } = await supabase
            .from("photo_categories")
            .delete()
            .eq("photo_id", photoIdToDelete)
            // .eq("category_id", category);

        if (photoCategoriesTableError) {
            console.error("Error deleting from photo_categories:", photoCategoriesTableError);
            throw photoCategoriesTableError;
        }

        const {data: remainingCategories, error: remainingCategoriesError} = await supabase
            .from("photo_categories")
            .select("photo_id")
            .eq("photo_id", photoIdToDelete);

        if (remainingCategoriesError) throw remainingCategoriesError;
    
        if (!remainingCategories || remainingCategories.length === 0) {
            const {error: photoTableError} = await supabase
                .from("photos")
                .delete()
                .eq("id", photoIdToDelete);

            if (photoTableError) throw photoTableError;

            const photoName = url.split("/").pop();

            const { error: storageError } = await supabase.storage
                .from("images")
                .remove([photoName]);

                if (storageError) {
                    console.error("Error deleting from storage:", storageError);
                    throw storageError;
                }
        }

        return res.json({
            success: true,
            message: "Photo deleted successfully from the category.",
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
};

export default deletePhoto;
