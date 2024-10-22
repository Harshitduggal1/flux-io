import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

// Create an instance of the uploadthing utility
const f = createUploadthing();

// Define the FileRouter for your app, which can contain multiple FileRoutes
export const ourFileRouter = {
  // Define a route for video or audio uploads
  videoOrAudioUploader: f({ video: { maxFileSize: "32MB" } })
    // Middleware to check user authentication before upload
    .middleware(async ({ req }) => {
      // Get the user session using Kinde authentication
      const { getUser } = getKindeServerSession();
      const user = await getUser();

      // Check if the user is authenticated
      if (!user || !user.id) throw new UploadThingError("Unauthorized");

      // Return the user ID for use in the onUploadComplete callback
      return { userId: user.id };
    })
    // Callback function that runs on the server after upload is complete
    .onUploadComplete(async ({ metadata, file }) => {
      // Log upload details
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.url);

      // Return data to be sent to the client-side onClientUploadComplete callback
      return { userId: metadata.userId, file };
    }),
} satisfies FileRouter;

// Export the type of our FileRouter for use in other parts of the application
export type OurFileRouter = typeof ourFileRouter;
