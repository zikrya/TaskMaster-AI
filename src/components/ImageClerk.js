import { useUser } from '@clerk/nextjs';
import Image from 'next/image';

const ImageClerk = () => {
  const { user } = useUser();

  if (!user) {
    return null;
  }

  // Generate profile picture URL with optimization parameters
  const profilePictureUrl = `${user.imageUrl}?height=200&width=200&quality=100&fit=crop`;

  return (
    <div className="flex justify-center mt-8">
      <Image src={profilePictureUrl} alt="Profile Picture" width={100} height={100} className="rounded-full" />
    </div>
  );
};

export default ImageClerk;
