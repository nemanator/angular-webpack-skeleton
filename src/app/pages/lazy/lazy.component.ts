/*
 * MIT License
 *
 * Copyright (c) 2017 Stefano Cappa
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/**
 * Component of the lazy loaded module
 */

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { PageHeader } from '../../shared/components/components';
import { ExampleService } from '../../core/services/example.service';

import { Store } from '@ngrx/store';
import * as fromPageNum from './reducers';
import * as PageNum from './actions/page-num';

console.log('`Lazy` component loaded asynchronously');

@Component({
  selector: 'mmw-cv-page',
  templateUrl: 'lazy.html',
  styleUrls: ['lazy.scss']
})
export class LazyComponent implements OnInit, OnDestroy {
  public pageHeader: PageHeader;

  private pageNum$: Observable<number>;
  private pageNumSubscription: Subscription;
  private exampleServiceSubscription: Subscription;

  constructor(private exampleService: ExampleService,
              private store: Store<fromPageNum.State>) {

    this.pageHeader = new PageHeader('LAZY', '');

    this.pageNum$ = this.store.select(fromPageNum.getPageNum);

    // example of ngrx-store's usage
    // subscribe to pageNum
    this.pageNumSubscription = this.pageNum$.subscribe((val: number) => {
      console.log(`Page num retrieved from ngrx is ${val}`);
    });

    // call a service and dispatch an action to ng-rx to trigger the pageNumSubscription
    this.exampleServiceSubscription = this.exampleService.getExample().subscribe((val: string) => {
      console.log(`Result of getExample ${val}`);

      // dispatch an action
      this.store.dispatch(new PageNum.SetPageNum(4));
    });

  }

  ngOnInit() {
    console.log('Init called');
  }

  ngOnDestroy() {
    console.log('Destroy called');
    this.pageNumSubscription.unsubscribe();
    this.exampleServiceSubscription.unsubscribe();
  }
}
