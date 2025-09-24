"use client";

import React, { useEffect, useRef } from "react";

const Game: React.FC = () => {
  const gameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let Phaser: any;

    (async () => {
      Phaser = (await import("phaser")).default;

      if (!gameRef.current) return;

      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        width: 300,
        height: 300,
        parent: gameRef.current,
        backgroundColor: "#ffffff",
        scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH,
        },
        scene: {
          preload: preload,
          create: create,
          update: update,
        },
      };

      const game = new Phaser.Game(config);

      function preload() {}

      function create(this: Phaser.Scene) {
        const graphics = this.add.graphics();
        graphics.lineStyle(4, 0x000000, 1);

        // Draw vertical lines
        graphics.beginPath();
        graphics.moveTo(100, 0);
        graphics.lineTo(100, 300);
        graphics.moveTo(200, 0);
        graphics.lineTo(200, 300);

        // Draw horizontal lines
        graphics.moveTo(0, 100);
        graphics.lineTo(300, 100);
        graphics.moveTo(0, 200);
        graphics.lineTo(300, 200);

        graphics.strokePath();
        graphics.closePath();

        // Interactive cells
        const size = 100;
        const board: string[][] = [
          ["", "", ""],
          ["", "", ""],
          ["", "", ""],
        ];
        let currentPlayer = "X";

        for (let y = 0; y < 3; y++) {
          for (let x = 0; x < 3; x++) {
            const rect = this.add
              .rectangle(x * size + size / 2, y * size + size / 2, size, size, 0xffffff, 0)
              .setStrokeStyle(1, 0x000000)
              .setInteractive();
            rect.on("pointerdown", () => {
              if (board[y][x] !== "") return;

              board[y][x] = currentPlayer;

              // Add X or O text
              this.add
                .text(x * size + size / 2, y * size + size / 2, currentPlayer, {
                  fontSize: "64px",
                  color: "#000000",
                })
                .setOrigin(0.5);

              // Check winner
              const winner = checkWinner(board);
              if (winner) {
                setTimeout(() => {
                  alert(winner === "Draw" ? "Draw!" : `${winner} Wins!`);
                  this.scene.restart(); 
                }, 100);
              } else {
                currentPlayer = currentPlayer === "X" ? "O" : "X";
              }
            });
          }
        }

        function checkWinner(board: string[][]) {
          // Rows
          for (let i = 0; i < 3; i++) {
            if (board[i][0] && board[i][0] === board[i][1] && board[i][1] === board[i][2])
              return board[i][0];
          }
          // Columns
          for (let i = 0; i < 3; i++) {
            if (board[0][i] && board[0][i] === board[1][i] && board[1][i] === board[2][i])
              return board[0][i];
          }
          // Diagonals
          if (board[0][0] && board[0][0] === board[1][1] && board[1][1] === board[2][2])
            return board[0][0];
          if (board[0][2] && board[0][2] === board[1][1] && board[1][1] === board[2][0])
            return board[0][2];

          // Draw
          if (board.flat().every((cell) => cell !== "")) return "Draw";

          return null;
        }
      }

      function update() {}

      return () => {
        game.destroy(true);
      };
    })();
  }, []);

  return <div ref={gameRef} style={{ width: 300, height: 300 }}></div>;
};

export default Game;
