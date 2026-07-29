import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach } from 'vitest';
import { LoadingStateComponent } from '../app/shared/loading-state/loading-state.component';

describe('LoadingStateComponent', () => {
  let component: LoadingStateComponent;
  let fixture: ComponentFixture<LoadingStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingStateComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(LoadingStateComponent);
    component = fixture.componentInstance;
  });

  it('should completely hide from the DOM when active() is false', () => {
    fixture.componentRef.setInput('active', false);
    fixture.detectChanges();

    const overlay = fixture.debugElement.query(By.css('.loading-overlay'));
    
    expect(overlay).toBeNull();
  });

  it('should display and render the dynamic text when active() is true', () => {
    fixture.componentRef.setInput('active', true);
    fixture.componentRef.setInput('label', 'Sincronizando feed...');
    fixture.detectChanges();

    const overlay = fixture.debugElement.query(By.css('.loading-overlay'));
    
    expect(overlay).not.toBeNull();
    expect(overlay.nativeElement.textContent).toContain('Sincronizando feed...');
  });
});
