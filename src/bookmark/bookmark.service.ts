import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookmarkService {
    constructor(private prisma: PrismaService) { }

    async createBookmark(userId: number, dto: CreateBookmarkDto) {
        const bookmark = await this.prisma.bookmark.create({
            data: {
                ...dto,
                user: {
                    connect: {
                        id: userId,
                    },
                },
            },
        });
        return bookmark;
    }

    async editBookmark(userId: number, bookmarkId: number, dto: EditBookmarkDto) {
        const bookmark = await this.prisma.bookmark.findUnique({
            where: {
                id: bookmarkId,
            },
        });
        if (!bookmark) {
            throw new NotFoundException('Bookmark not found');
        }

        if (bookmark && bookmark.userId !== userId) {
            throw new ForbiddenException('Access to this resource is forbidden');
        }
        return this.prisma.bookmark.update({
            where: {
                id: bookmarkId,
            },
            data: {
                ...dto,
            },
        });
    }

    async getBookmarks(userId: number) {
        return await this.prisma.bookmark.findMany({
            where: {
                userId,
            },
        });

    }

    async getBookmarkById(userId: number, bookmarkId: number) {
        const bookmark = await this.prisma.bookmark.findFirst({
            where: {
                id: bookmarkId,
                userId,
            },
        });

        if (!bookmark) {
            throw new NotFoundException('Bookmark not found');
        }

        if (bookmark && bookmark.userId !== userId) {
            throw new ForbiddenException('Access to this resource is forbidden');
        }

        return bookmark;
    }

    async deleteBookmark(userId: number, bookmarkId: number) {
        const bookmark = await this.prisma.bookmark.findUnique({
            where: {
                id: bookmarkId,
            },
        });
        if (!bookmark) {
            throw new NotFoundException('Bookmark not found');
        }

        if (bookmark && bookmark.userId !== userId) {
            throw new ForbiddenException('Access to this resource is forbidden');
        }

        return this.prisma.bookmark.delete({
            where: {
                id: bookmarkId,
                userId,
            },
        });
    }
}
