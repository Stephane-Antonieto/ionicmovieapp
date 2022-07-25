import { environment } from './../../../environments/environment';
import { MovieService } from './../../services/movie.service';
import { Component, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.page.html',
  styleUrls: ['./movies.page.scss'],
})
export class MoviesPage implements OnInit {
  movies = [];
  currentPage = 1;
  imageBaseUrl = environment.images;

  constructor(
    private movieService: MovieService,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.laodMovies();
  }

  async laodMovies(event?: InfiniteScrollCustomEvent) {
    const laoding = await this.loadingCtrl.create({
      message: 'loading',
      spinner: 'bubbles',
    });
    await laoding.present();

    this.movieService.getTopRatedMovies(this.currentPage).subscribe((res) => {
      // console.log(res.results);
      this.loadingCtrl.dismiss();
      this.movies.push(...res.results);
      event?.target.complete();
      if (event) {
        event.target.disabled = res.total_pages === this.currentPage;
      }
    });
  }

  loadMore(event: InfiniteScrollCustomEvent) {
    this.currentPage++;
    this.laodMovies(event);
  }
}
