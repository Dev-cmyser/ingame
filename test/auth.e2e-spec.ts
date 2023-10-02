import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'

describe('Ingame tetst service', () => {
  const mock4 = { phone: '+79989358273', typeLogin: 'SS' }
  const url = 'http://localhost:8080/auth/'
  it(`FAIL, неверный тип входа phone/ (Post)`, () => {
    return request(url)
      .post('phone')
      .set('Accept', 'application/json')
      .send(mock4)

      .expect(400)
  })
  const mock1 = { phone: '+79269458278', typeLogin: 'SMS' }
  let operation: string
  let codeOp: string

  it(`Succes. phone/ (Post)`, async () => {
    return await request(url)
      .post('phone')
      .set('Accept', 'application/json')
      .send(mock1)
      .expect((response: request.Response) => {
        const { operationId, code } = response.body.data

        // console.log(response.body)
        operation = operationId
        codeOp = code
        // console.log(response.body)
        expect(typeof operationId).toEqual('string')
        expect(typeof code).toEqual('string')
      })

      .expect(200)
  })

  const mock3 = { phone: '+79269458278', typeLogin: 'SMS' }
  it(`FAIL. лимит таймаут phone/ (Post)`, () => {
    return (
      request(url)
        .post('phone')
        .set('Accept', 'application/json')
        .send(mock3)
        // .expect((response: request.Response) => {
        // })

        .expect(408)
    )
  })

  const mock2 = { phone: '816', typeLogin: 'SMS' }
  it(`FAIL, неверный телефон  phone/ (Post)`, () => {
    return request(url)
      .post('phone')
      .set('Accept', 'application/json')
      .send(mock2)

      .expect(400)
  })

  let accessToken: string
  let refreshToken: string

  it(`Succes  code/ (Post)`, async () => {
    return await request(url)
      .post('code')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      // так и надо! иначе не читает поля!
      .send({ operationId: operation, code: codeOp })
      .expect((response: request.Response) => {
        const { data } = response.body

        // console.log(data, 11111111111111, response.body)
        accessToken = data.accessToken
        refreshToken = data.refreshToken
        expect(typeof data.accessToken).toEqual('string')
        expect(typeof data.refreshToken).toEqual('string')
        // console.log(accessToken)
      })

      .expect(200)
  })

  const mock6 = { operationId: operation, code: '1111' }
  it(`FAIL  code/ (Post)`, async () => {
    return await request(url)
      .post('code')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      // так и надо! иначе не читает поля!
      .send(mock6)
      .expect((response: request.Response) => {
        const { meta } = response.body
      })

      .expect(400)
  })

  const mock7 = { refreshToken: refreshToken }
  it(`Succes  update/ (Post)`, async () => {
    return await request(url)
      .post('update')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      // так и надо! иначе не читает поля!
      .send({ refreshToken: refreshToken })
      .expect((response: request.Response) => {
        const { data } = response.body
        accessToken = data.accessToken
        expect(typeof data.accessToken).toEqual('string')
        expect(typeof data.refreshToken).toEqual('string')
      })

      .expect(200)
  })

  const mock8 = { refreshToken: 'some diff' }
  it(`FAIL  update/ (Post)`, async () => {
    return await request(url)
      .post('update')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      // так и надо! иначе не читает поля!
      .send(mock8)

      .expect(400)
  })
})
