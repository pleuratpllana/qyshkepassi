import { QRCode } from "react-qrcode-logo";

const QRCodePreview = ({ value, options }) => {
  if (!value) return null;

  const {
    dotsOptions,
    backgroundOptions,
    logo,
    text,
    textOptions
  } = options || {};

  return (
    <QRCode
      value={value}
      size={256}
      fgColor={dotsOptions?.color || "#000000"}
      bgColor={backgroundOptions?.color || "#ffffff"}
      ecLevel="H"
      qrStyle={dotsOptions?.type || "squares"} 
      logoImage={logo || undefined}
      logoWidth={50}
      logoHeight={50}
      quietZone={10}
    />
  );
};

export default QRCodePreview;
