
import { createRequire } from "module";
const cjsRequire = createRequire(import.meta.url);
const _M_ = cjsRequire("./node_natives/@serialport/bindings-cpp.native.cjs");
export const __esModule = _M_.__esModule;
export const autoDetect = _M_.autoDetect;
export const DarwinBinding = _M_.DarwinBinding;
export const DarwinPortBinding = _M_.DarwinPortBinding;
export const LinuxBinding = _M_.LinuxBinding;
export const LinuxPortBinding = _M_.LinuxPortBinding;
export const WindowsBinding = _M_.WindowsBinding;
export const WindowsPortBinding = _M_.WindowsPortBinding;
export const BindingsError = _M_.BindingsError;
const keyword_default = _M_.default || _M_;
export {
  keyword_default as default,
};
