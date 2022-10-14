package main

import (
	"embed"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"

	fe "stlmhelper/lib/folderexploder"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	// Create an instance of the app structure
	app := NewApp()

	exploder := &fe.Exploder{}

	// Create application with options
	err := wails.Run(&options.App{
		Title:            "stlm-helper",
		Width:            1024,
		Height:           768,
		Assets:           assets,
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		OnStartup:        app.startup,
		Bind: []interface{}{
			app,
			exploder,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
