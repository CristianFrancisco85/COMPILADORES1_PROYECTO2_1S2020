package main

import (
	"fmt"
	"log"
	"net/http"
)

func main() {

	http.Handle("/", http.FileServer(http.Dir("./src")))

	fmt.Printf("Iniciando Servidor...\n")

	if err := http.ListenAndServe(":3000", nil); err != nil {
		log.Fatal(err)
	}
}
