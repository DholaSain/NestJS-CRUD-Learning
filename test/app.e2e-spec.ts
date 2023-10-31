import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import * as pactum from 'pactum';
import { AuthDto } from '../src/auth/dto';
import { EditUserDto } from '../src/user/dto';
import { CreateBookmarkDto } from 'src/bookmark/dto';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    await app.init();
    await app.listen(3000);

    prisma = app.get(PrismaService);


    await prisma.cleanDB();
    pactum.request.setBaseUrl('http://localhost:3000');

  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'huehue@test.com',
      password: '123456',
    }
    describe('Signup', () => {

      it('should throw if email is empty', () => {
        return pactum.spec().post('/auth/signup').withBody({ password: dto.password }).expectStatus(400);
      });

      it('should throw if password is empty', () => {
        return pactum.spec().post('/auth/signup').withBody({ email: dto.email }).expectStatus(400);
      });

      it('should throw if no body is provided', () => {
        return pactum.spec().post('/auth/signup').expectStatus(400);
      });

      it('Should signup a new user', () => {
        return pactum.spec().post('/auth/signup').withBody(dto).expectStatus(201);
      });
    });

    describe('Signin', () => {

      it('should throw if email is empty', () => {
        return pactum.spec().post('/auth/signin').withBody({ password: dto.password }).expectStatus(400);
      });

      it('should throw if password is empty', () => {
        return pactum.spec().post('/auth/signin').withBody({ email: dto.email }).expectStatus(400);
      });

      it('should throw if no body is provided', () => {
        return pactum.spec().post('/auth/signin').expectStatus(400);
      });

      it('Should signin a user', () => {
        return pactum.spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .stores('userAt', 'access_token');
      });
    });
  });

  describe('User', () => {
    describe('Get me', () => {
      it('should throw if no token is provided', () => {
        return pactum.spec().get('/users/me').expectStatus(401);
      });

      it('should return a user', () => {
        return pactum.spec().get('/users/me').withBearerToken('$S{userAt}').expectStatus(200);
      })
    });

    describe('Edit User', () => {
      it('should throw if no token is provided', () => {
        return pactum.spec().patch('/users').expectStatus(401);
      });

      it('should edit a user', () => {
        const editDto: EditUserDto = {
          firstName: 'Test',
          email: 'test@test.com',
        }
        return pactum.spec().patch('/users').withBearerToken('$S{userAt}').withBody(editDto).expectStatus(200).expectBodyContains(editDto.firstName).expectBodyContains(editDto.email);
      });
    });

    describe('Bookmark', () => {
      describe('Get empty list of bookmarks', () => {
        it('Should return empty list', () => {
          return pactum.spec().get('/bookmarks').withBearerToken('$S{userAt}').expectStatus(200).expectBodyContains([]);
        });
      });

      describe('Create', () => {
        const createBookmarkDto: CreateBookmarkDto = {
          title: 'Test',
          link: 'http://test.com',
        }

        it('Should throw if no token is provided', () => {
          return pactum.spec().post('/bookmarks').withBody(createBookmarkDto).expectStatus(401);
        });

        it('Should throw if no body is provided', () => {
          return pactum.spec().post('/bookmarks').withBearerToken('$S{userAt}').expectStatus(400);
        });

        it('Should throw if title is empty', () => {
          return pactum.spec().post('/bookmarks').withBearerToken('$S{userAt}').withBody({ link: createBookmarkDto.link }).expectStatus(400);
        });

        it('Should create a bookmark', () => {
          return pactum.spec().post('/bookmarks').withBearerToken('$S{userAt}').withBody(createBookmarkDto).expectStatus(201).stores('bookmarkId', 'id');
        });
      });

      describe('Get All', () => {
        it('Should return a list of bookmarks', () => {
          return pactum.spec().get('/bookmarks').withBearerToken('$S{userAt}').expectStatus(200).expectJsonLength(1);
        });
      });

      describe('Get by ID', () => {
        it('Should throw if no token is provided', () => {
          return pactum.spec().get('/bookmarks/$S{bookmarkId}').expectStatus(401);
        });

        it('Should return a bookmark', () => {
          return pactum.spec().get('/bookmarks/$S{bookmarkId}').withBearerToken('$S{userAt}').expectStatus(200).expectBodyContains('$S{bookmarkId}');
        });
      });

      describe('Edit', () => {
        it('Should throw if no token is provided', () => {
          return pactum.spec().patch('/bookmarks/$S{bookmarkId}').expectStatus(401);
        });

        it('Should edit a bookmark', () => {
          return pactum.spec().patch('/bookmarks/$S{bookmarkId}').withBearerToken('$S{userAt}').withBody({ title: 'Testing' }).expectStatus(200).expectBodyContains('Testing');
        });
      });

      describe('Delete', () => {
        it('Should throw if no token is provided', () => {
          return pactum.spec().delete('/bookmarks/$S{bookmarkId}').expectStatus(401);
        });

        it('Should delete a bookmark', () => {
          return pactum.spec().delete('/bookmarks/$S{bookmarkId}').withBearerToken('$S{userAt}').expectStatus(204);
        });
      });
    });

  });
});