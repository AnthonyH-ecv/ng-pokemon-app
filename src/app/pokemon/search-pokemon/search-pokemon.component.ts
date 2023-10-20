import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import {
  Observable,
  Subject,
  debounceTime,
  distinctUntilChanged,
  of,
  switchMap,
} from 'rxjs'
import { Pokemon } from '../pokemon'
import { PokemonService } from '../pokemon.service'

@Component({
  selector: 'app-search-pokemon',
  templateUrl: './search-pokemon.component.html',
  styles: [],
})
export class SearchPokemonComponent implements OnInit {
  searchTerms = new Subject<string>() // flux de donnée dans le temps avec les recherches de l'utilisateur {...'a'..'ab'....'abz'...'ab'..'abc'}
  pokemons$: Observable<Pokemon[]> // variable avec $ est une convention pour indiquer que c'est un flux

  // le pipe |async est un raccourci de this.pokemons$.subscribe(pokemons => this.pokemons = pokemons)

  constructor(private router: Router, private pokemonService: PokemonService) {}

  ngOnInit(): void {
    this.pokemons$ = this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term) =>
        term.length <= 1 ? of([]) : this.pokemonService.searchPokemonList(term)
      )
    )
  }

  search(term: string) {
    this.searchTerms.next(term)
  }

  goToDetail(pokemon: Pokemon) {
    this.router.navigate(['/pokemon', pokemon.id])
  }
}
