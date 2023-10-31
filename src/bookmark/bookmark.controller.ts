import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../guard';
import { BookmarkService } from './bookmark.service';
import { GetUser } from '../auth/decorator';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';

@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarkController {
    constructor(private bookmarkService: BookmarkService) { }

    @Post()
    createBookmark(@GetUser('id') userId: number, @Body() bookmarkDto: CreateBookmarkDto) {
        return this.bookmarkService.createBookmark(userId, bookmarkDto);
    }

    @Get()
    getBookmarks(@GetUser('id') userId: number) {
        return this.bookmarkService.getBookmarks(userId);
    }

    @Get(':id')
    getBookmarkById(@GetUser('id') userId: number, @Param('id', ParseIntPipe) id: number) {
        return this.bookmarkService.getBookmarkById(userId, id);
    }

    @Patch(':id')
    editBookmark(@GetUser('id') userId: number, @Param('id', ParseIntPipe) id: number, @Body() bookmarkDto: EditBookmarkDto) {
        return this.bookmarkService.editBookmark(userId, id, bookmarkDto);
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    deleteBookmark(@GetUser('id') userId: number, @Param('id', ParseIntPipe) id: number) {
        return this.bookmarkService.deleteBookmark(userId, id);
    }
}
