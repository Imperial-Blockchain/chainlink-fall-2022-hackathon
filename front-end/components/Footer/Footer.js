import footerIcons from "./footerIcons";

const Footer = () => {
  return (
    <footer
      className="mt-5 text-center lg:text-left bg-gradient-to-r from-gray-600 to-gray-800 text-gray-100"
      style={{ height: 150 }}
    >
      <div className="flex justify-center items-center lg:justify-between p-6 mb-0">
        <div className="mr-12 hidden lg:block">
          <span>Get connected with us on social networks:</span>
        </div>
        <div className="flex justify-center">
          {footerIcons.map((icon, idx) => (
            <a key={idx} href="#!" className="mr-6 text-gray-100">
              {icon}
            </a>
          ))}
        </div>
      </div>

      <div className="text-center p-6 mt-0">
        <span>© 2022 Copyright: </span>
        <a
          className="text-blue-400 font-semibold"
          href="https://www.imperialcollegeunion.org/activities/a-to-z/blockchain"
        >
          ICL Blockchain Group
        </a>
      </div>
    </footer>
  );
};

export default Footer;
