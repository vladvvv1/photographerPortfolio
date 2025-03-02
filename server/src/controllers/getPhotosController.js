import { supabase } from "../config/supabaseClient.js";

const getPhoto = async (req, res) => {
    try {
        const { category } = req.body;

        const { data: categoryData, error: categoryError } = await supabase
            .from("categories")
            .select("id")
            .eq("name", category)
            .single();

        console.log("Category id:", categoryData.id);

        if (categoryError)
            return res.status(404).json({ error: "Category not found." });

        const { data: photoId, error: relationError } = await supabase
            .from("photo_categories")
            .select("photo_id")
            .eq("category_id", categoryData.id);

        if (relationError) throw relationError;

        console.log("Photo id: ", photoId);

        const photoIdList = photoId.map((p) => p.photo_id);
        console.log(photoIdList);

        const { data: photos, error: photosError } = await supabase
            .from("photos")
            .select("*")
            .in("id", photoIdList);

        if (photosError) throw photosError;

        res.json(photos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export default getPhoto;
