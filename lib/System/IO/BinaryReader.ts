import {AsyncResult} from '../../Core/types';
import ArgumentNullException from '../../Core/Exceptions/ArgumentNullException';
import {ByteOrder} from './types';
import Stream from '../Stream/Stream';


export default class BinaryReader {
    private _baseStream: Stream<Buffer>;
    private _internalBuffer: Buffer;
    private _internalBufferOffset: number = 0;


    public get baseStream(): Stream<Buffer> {
        return this._baseStream;
    }


    public constructor(baseStream: Stream<Buffer>) {
        if (baseStream == null) {
            throw new ArgumentNullException('fileStream');
        }

        this._baseStream = baseStream;
    }


    public async read(bytesCount: number): AsyncResult<Buffer> {
        return this._baseStream.read(bytesCount);
    }


    public async readUInt(byteOrder: ByteOrder, bytesCount: number): AsyncResult<number> {
        let buffer: Buffer = await this.read(bytesCount);

        if (byteOrder === ByteOrder.BigEndian) {
            return buffer.readUIntBE(0, bytesCount);
        } else {
            return buffer.readUIntLE(0, bytesCount);
        }
    }


    public async readInt(byteOrder: ByteOrder, bytesCount: number): AsyncResult<number> {
        let buffer: Buffer = await this.read(bytesCount);

        if (byteOrder === ByteOrder.BigEndian) {
            return buffer.readIntBE(0, bytesCount);
        } else {
            return buffer.readIntLE(0, bytesCount);
        }
    }


    public async readFloat(byteOrder: ByteOrder): AsyncResult<number> {
        let buffer: Buffer = await this.read(4);

        if (byteOrder === ByteOrder.BigEndian) {
            return buffer.readFloatBE(0);
        } else {
            return buffer.readFloatLE(0);
        }
    }


    public async readDouble(byteOrder: ByteOrder): AsyncResult<number> {
        let buffer: Buffer = await this.read(8);

        if (byteOrder === ByteOrder.BigEndian) {
            return buffer.readDoubleBE(0);
        } else {
            return buffer.readDoubleLE(0);
        }
    }


    public async readUInt8(byteOrder: ByteOrder): AsyncResult<number> {
        return this.readUInt(byteOrder, 1);
    }


    public async readUInt16(byteOrder: ByteOrder): AsyncResult<number> {
        return this.readUInt(byteOrder, 2);
    }


    public async readUInt24(byteOrder: ByteOrder): AsyncResult<number> {
        return this.readUInt(byteOrder, 3);
    }


    public async readUInt32(byteOrder: ByteOrder): AsyncResult<number> {
        return this.readUInt(byteOrder, 4);
    }


    public async readInt8(byteOrder: ByteOrder): AsyncResult<number> {
        return this.readInt(byteOrder, 1);
    }


    public async readInt16(byteOrder: ByteOrder): AsyncResult<number> {
        return this.readInt(byteOrder, 2);
    }


    public async readInt24(byteOrder: ByteOrder): AsyncResult<number> {
        return this.readInt(byteOrder, 3);
    }


    public async readInt32(byteOrder: ByteOrder): AsyncResult<number> {
        return this.readInt(byteOrder, 4);
    }


    protected async fillBuffer(bytesToRead: number): AsyncResult<void> {

    }
}