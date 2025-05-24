import { createSupabaseWithoutToken } from "../config/supabaseClient.js";

const getPhoto = async (req, res) => {
    try {
        let { category } = req.body;
        const supabase = createSupabaseWithoutToken;

        if (!Array.isArray(category)) {
            category = [category];
        }

        const { data: categoryData, error: categoryError } = await supabase
            .from("categories")
            .select("id")
            .in("name", category);

        if (categoryError) {
            console.log(categoryError);
            return res.status(404).json({ error: "Category not found." });
        }

        const category_id = categoryData.map(item => item.id);

        if (category_id.length === 0) {
            return res.status(404).json({ error: "No matching categories found." });
        }

        const { data: photoId, error: relationError } = await supabase
            .from("photo_categories")
            .select("photo_id")
            .in("category_id", category_id);

        if (relationError) throw relationError;

        const photoIdList = photoId.map((p) => p.photo_id);
      
        const { data: photos, error: photosError } = await supabase
            .from("photos")
            .select("*")
            .in("id", photoIdList);

        if (photosError) throw photosError;

        console.log("Fetched pictures: ", photos);
        res.json(photos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export default getPhoto;
