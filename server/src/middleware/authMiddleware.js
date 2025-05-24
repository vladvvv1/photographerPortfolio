import {createSupabaseWithToken} from "../config/supabaseClient.js"

export default async (req, res, next) => {
  // Retrieve the access token from the Authorization header
  // const authHeader = req.headers.authorization;
  const authHeader = req.cookies.access_token;
  const supabase = createSupabaseWithToken(authHeader);
   
  if (!authHeader) return res.status(401).json({ error: "Not authenticated" });

  let token = authHeader.split(" ")[1];

  // Attempt to get the user associated with the access token
  let { data, error } = await supabase.auth.getUser(token);

  // If the token is expired, attempt to refresh it using the access token itself
  if (error && error.message.toLowerCase().includes("expired")) {
    // If expired, send a response saying the token needs to be refreshed by the client
    return res.status(401).json({ error: "Access token expired, please log in again" });
  }

  // If there's no error, everything is fine; assign the user data to the request object
  req.user = data.user;

  // Proceed to the next middleware
  next();
};
