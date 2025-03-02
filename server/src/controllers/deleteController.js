import { supabase } from "../config/supabaseClient.js";

const deletePhoto = async (req, res) => {
    try {
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({ error: "No URL provided." });
        }

        const { data: photoData, error: photoDataError } = await supabase
            .from("photos")
            .select("id")
            .eq("url", url)
            .single();

        if (photoDataError || !photoData) {
            return res.status(404).json({ error: photoDataError });
        }

        const photoId = photoData.id;

        const { error: photoCategoriesTableError } = await supabase
            .from("photo_categories")
            .delete()
            .eq("photo_id", photoId);

        if (photoCategoriesTableError) throw photoCategoriesTableError;

        const { error: photoTableError } = await supabase
            .from("photos")
            .delete()
            .eq("id", photoId);

        if (photoTableError) throw photoTableError;

        const photoName = url.split("/").pop();

        const { error: storageError } = await supabase.storage
            .from("images")
            .remove([photoName]);

        if (storageError) throw storageError;

        return res.json({
            success: true,
            message: "Photo deleted successfully.",
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export default deletePhoto;
