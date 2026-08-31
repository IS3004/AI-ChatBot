import { IKContext, IKUpload } from "imagekitio-react";
import { useRef } from "react";
import { useAuth } from "@clerk/clerk-react";

const API_URL = import.meta.env.VITE_API_URL;
const urlEndpoint = import.meta.env.VITE_IMAGE_KIT_ENDPOINT;
const publicKey = import.meta.env.VITE_IMAGE_KIT_PUBLIC_KEY;

/**
 * Fetches ImageKit auth params from our backend (signed by our private key).
 */
const authenticator = async () => {
  // We can't use hooks inside a regular function, so we pass the token via closure
  const res = await fetch(`${API_URL}/api/upload`, { credentials: "include" });
  if (!res.ok) throw new Error("ImageKit authentication failed");
  return res.json();
};

/**
 * Upload component — renders a hidden IKUpload input and a visible trigger button.
 * @param {Function} onSuccess - Called with the uploaded file object
 * @param {Function} onError  - Called with the error
 * @param {boolean}  uploading - Whether an upload is in progress
 * @param {Function} setUploading - Sets uploading state in parent
 */
const Upload = ({ onSuccess, onError, uploading, setUploading }) => {
  const uploadRef = useRef(null);

  return (
    <IKContext urlEndpoint={urlEndpoint} publicKey={publicKey} authenticator={authenticator}>
      <IKUpload
        ref={uploadRef}
        fileName="chat-image"
        folder="/ai-chat-uploads"
        onSuccess={onSuccess}
        onError={(err) => {
          setUploading(false);
          onError(err);
        }}
        onUploadStart={() => setUploading(true)}
        onUploadProgress={() => {}}
        style={{ display: "none" }}
        accept="image/*"
      />
      <button
        type="button"
        className="upload-btn"
        title="Upload an image"
        onClick={() => uploadRef.current?.click()}
        disabled={uploading}
      >
        {uploading ? (
          <span className="upload-spinner" />
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        )}
      </button>
    </IKContext>
  );
};

export default Upload;
