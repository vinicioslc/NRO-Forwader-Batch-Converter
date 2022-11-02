const path = require("path");
const child = require("child_process");
const { randomUUID } = require("crypto");
const fs = require("fs");
const defaultRetroarchPath = "switch/retroarch_switch.nro";
const hackBrewPath = path.join(__dirname, "hbp", "hacbrewpack.exe");
const hackBrewPathBuild = path.join(__dirname, "hbp/build.bat");
const nspsDir = path.join(__dirname, "NSPs");
const getNSPOutputFile = (forwarder) =>
  path.join(nspsDir, forwarder.titleId + ".nsp");
const generateNiceOutputFileName = (forwarder) =>
  path.join(nspsDir, `${forwarder.name} [${forwarder.titleId}].nsp`);

const keyLocation = path.join(__dirname, "prod.keys");
const nextArgvPath = path.join(__dirname, "hbp\\romfs\\nextArgv");
const nextNroPathPath = path.join(__dirname, "hbp\\romfs\\nextNroPath");

const forwarders = require("./games_list.json");

async function main() {
  for (const forwarder of forwarders.map(formatAndGenerateGameData)) {
    const result = await generateForwarder(forwarder);
  }
  console.log("end");
}

main()
  .then((data) => {
    console.log(data);
    process.exit(0);
  })
  .catch((e) => {
    console.warn(e);
    process.exit(1);
  });

function formatAndGenerateGameData(value) {
  value.icon = path.join(__dirname, "icons", value.icon);
  if (!value.titleId) {
    const randomTitleId = generateRandomTitleId();
    value.titleId = randomTitleId;
  }
  return value;
}

async function generateForwarder(forwarder) {
  await writeIconFile(forwarder);
  await writeStartupArgs(forwarder);
  const command = `${hackBrewPath} --titleid "${forwarder.titleId}" --titlename "${forwarder.name}" --titlepublisher "${forwarder.publisher}" --nspdir "${nspsDir}" --keyset "${keyLocation}"`;
  // const command = `${hackBrewPathBuild} "${forwarder.name}" ${forwarder.icon} ${forwarder.nro_path} ${forwarder.rom_path}`;
  const isEqual =
    command ===
    `build.bat "Front Mission SNES (PT-BR)" "C:/batch_generator/icons/front-mission-snes.jpg" "retroarch/cores/snes9x_libretro_libnx.nro" "retroarch/downloads/Super Nintendo/Front Mission PT-BR (J).smc"`;
  const result = child.execSync(command, {
    cwd: path.join(__dirname, "hbp"),
    stdio: "inherit",
  });

  renameOutputFile(forwarder);
}
function renameOutputFile(forwarder) {
  const hacbrewPath = getNSPOutputFile(forwarder);
  const nicePath = generateNiceOutputFileName(forwarder);
  console.log(
    "----------------------------------------------------------------"
  );
  if (fs.existsSync(hacbrewPath)) {
    fs.copyFileSync(hacbrewPath, nicePath);
    if (fs.existsSync(nicePath)) {
      fs.rmSync(hacbrewPath);
      console.log("Finished file:", nicePath);
    }
  }
  console.log(
    "----------------------------------------------------------------"
  );
}

function generateRandomTitleId() {
  return (
    "01" +
    Date.now().toString().substring(0, 1) +
    randomUUID()
      .toLowerCase()
      .replace(/[^a-zA-Z0-9 ]/g, "")
      .substring(0, 9)
      .toString() +
    "2000"
  );
}
function writeIconFile(forwarder) {
  fs.copyFileSync(
    forwarder.icon,
    path.join(__dirname, "hbp", "control", "icon_AmericanEnglish.dat")
  );
}

function writeStartupArgs(forwarder) {
  let pathToNro = `sdmc:${forwarder.nro_path}`;
  fs.writeFileSync(nextNroPathPath, pathToNro, {
    encoding: "utf8",
  });

  if (forwarder.rom_path) {
    pathToNro = pathToNro + ` "sdmc:${forwarder.rom_path}"`;
  }
  fs.writeFileSync(nextArgvPath, pathToNro, {
    encoding: "utf8",
  });
}
