import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-worker-avatar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="worker-avatar"
      [style.width.px]="size"
      [style.height.px]="size"
      [style.fontSize.px]="fontSize"
      [style.background]="backgroundColor"
      [style.border]="border"
    >
      <img
        *ngIf="showImage"
        [src]="avatarUrl"
        [alt]="name"
        (error)="onImageError()"
        referrerpolicy="no-referrer"
      />
      <span *ngIf="!showImage" class="initials">{{ initials }}</span>
    </div>
  `,
  styles: [
    `
      .worker-avatar {
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        flex-shrink: 0;
        color: #fff;
        font-weight: 700;
        letter-spacing: 0.5px;
      }
      .worker-avatar img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .initials {
        line-height: 1;
        user-select: none;
      }
    `,
  ],
})
export class WorkerAvatarComponent implements OnChanges {
  @Input() name = '';
  @Input() avatarUrl = '';
  @Input() size = 44;
  @Input() border = '1px solid rgba(255, 159, 10, 0.35)';

  public showImage = false;

  get fontSize(): number {
    return Math.max(12, Math.round(this.size * 0.36));
  }

  get initials(): string {
    const parts = this.name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return '?';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }

  get backgroundColor(): string {
    const palette = [
      '#ff9f0a',
      '#30d158',
      '#64d2ff',
      '#bf5af2',
      '#ff453a',
      '#ffd60a',
      '#5e5ce6',
      '#ac8e68',
    ];
    let hash = 0;
    const key = this.name.trim().toLowerCase() || 'worker';
    for (let i = 0; i < key.length; i++) {
      hash = key.charCodeAt(i) + ((hash << 5) - hash);
    }
    return palette[Math.abs(hash) % palette.length];
  }

  ngOnChanges(): void {
    this.showImage = this.hasValidAvatar(this.avatarUrl);
  }

  onImageError(): void {
    this.showImage = false;
  }

  private hasValidAvatar(url: string): boolean {
    if (!url?.trim()) return false;
    if (url.includes('unsplash.com/photo-1')) return false;
    return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:');
  }
}
