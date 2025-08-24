
const { execSync } = require('child_process');
const fs = require('fs');

// 生成NSIS脚本
const nsisScript = `
!include "MUI2.nsh"
Name "HemyRender"
OutFile "executables/hemyrender_setup.exe"
InstallDir "$PROGRAMFILES\\HemyRender"

Section
  SetOutPath $INSTDIR
  File "dist/bundle.js"
  CreateShortCut "$SMPROGRAMS\\HemyRender.lnk" "$INSTDIR\\bundle.js"
  WriteUninstaller "$INSTDIR\\uninstall.exe"
SectionEnd

Section "Uninstall"
  Delete "$INSTDIR\\*.*"
  RMDir "$INSTDIR"
  Delete "$SMPROGRAMS\\HemyRender.lnk"
SectionEnd
`;

fs.writeFileSync('build/installer.nsi', nsisScript);
execSync('makensis build/installer.nsi', { stdio: 'inherit' });