import { ChangeDetectorRef, Component, OnInit } from "@angular/core";

const URL_PATH =
  "https://gist.githubusercontent.com/bar0191/fae6084225b608f25e98b733864a102b/raw/dea83ea9cf4a8a6022bfc89a8ae8df5ab05b6dcc/pokemon.json";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  title = "frontend-code-challenge";

  private pokemonList = []; // Store all the data from JSON
  private searchValue = "";
  public pokemonResultList = []; //Contains the pokemon list that matches the search to be displayed on the UI
  public loading = true;
  public sortMaxCP = false;

  constructor(private readonly cd: ChangeDetectorRef) {}

  public ngOnInit(): void {
    fetch(URL_PATH)
      .then((response) => response.json())
      .then((data) => {
        this.pokemonList = data;
        this.loading = false;
      });
  }

  public toggleMaxCPCheck(event) {
    this.sortMaxCP = event.target.checked;
    this.searchPokemon(this.searchValue);
  }

  public searchPokemonHandler(event): void {
    const search = event.target.value;
    this.searchValue = search;
    if (search) {
      this.searchPokemon(search);
    } else {
      this.pokemonResultList = []; // reset the visible list, when search is empty
    }
  }

  private searchPokemon(search) {
    this.loading = true;
    setTimeout(() => {
      this.pokemonResultList = this.filterPokemons(search);
      if (this.sortMaxCP) {
        this.pokemonResultList = this.sortMCP();
      }
      this.loading = false;
      this.cd.detectChanges();
    }, 300);
    // Just to simulte the search and make visible the
    // loading icon, using 300 since is the magin amout of min milisecons for the visual changes benn aknowledge for the human eye.
  }

  private filterPokemons(search: string) {
    const results = [];
    for (const pokemon of this.pokemonList) {
      if (pokemon.Name.includes(search) || pokemon.Types.includes(search)) {
        results.push(pokemon);
      }
      if (results.length >= 4) {
        return results;
      }
    }
    return results;
  }

  private sortMCP() {
    return this.pokemonResultList.sort((a, b) => {
      return b.MaxCP - a.MaxCP;
    });
  }
}
