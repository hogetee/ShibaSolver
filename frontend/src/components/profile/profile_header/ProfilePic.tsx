import Avatar from '@mui/material/Avatar';
type Props = {
  src?: string;
  alt?: string;
  size?: number; // px
};

export default function ProfilePic({ src, alt, size }: Props) {
  return (
    <>
      <Avatar alt={alt} src={src} sx={{ width: size ?? 160, height: size ?? 160 }} />
    </>
  );
}
