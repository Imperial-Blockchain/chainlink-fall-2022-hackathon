import footerIcons from "./footerIcons";

const Footer = () => {
  return (
    <footer
      class="mt-5 text-center lg:text-left bg-gray-900 text-gray-100"
      style={{ height: 150 }}
    >
      <div class="flex justify-center items-center lg:justify-between p-6 mb-0">
        <div class="mr-12 hidden lg:block">
          <span>Get connected with us on social networks:</span>
        </div>
        <div class="flex justify-center">
          {footerIcons.map((icon) => (
            <a href="#!" class="mr-6 text-gray-100">
              {icon}
            </a>
          ))}
        </div>
      </div>

      <div class="text-center p-6 mt-0">
        <span>© 2021 Copyright:</span>
        <a
          class="text-blue-400 font-semibold"
          href="https://www.imperialcollegeunion.org/activities/a-to-z/blockchain"
        >
          ICL Blockchain Group
        </a>
      </div>
    </footer>
  );
};

export default Footer;
