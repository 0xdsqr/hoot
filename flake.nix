{
  description = "🟪🦉 hoot - my implementation of a react like framework 🦉🟪";
  
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };
  
  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
      in {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            nodejs_22
            git
            bun
          ];
          
          shellHook = ''
            echo "🟪 bingbong 🟪"
          '';
        };
        
        checks = {
          test = pkgs.runCommand "test" {
            buildInputs = with pkgs; [ bun ];
          } ''
            cd ${self}
            bun run test:coverage:all
            touch $out
          '';
        };
      });
}