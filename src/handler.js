const {nanoid} = require('nanoid');
const notes = require('./notes');

const addNoteHandler = (request, h) => {
  // ambil nilai title, tags, body dari request body yang dikirim client
  const {title, tags, body} = request.payload;

  // membuat id unik dengan ukuran 16 string
  const id = nanoid(16);

  // membuat object baru dari class Date pake 'new'
  // lalu diubah ke string dengan standar ISO
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  // object untuk menyimpan note baru
  const newNote = {
    title, tags, body, id, createdAt, updatedAt,
  };

  // tambahkan note baru ke kumpulan note di notes.js
  notes.push(newNote);

  // memfilter note yang sudah masuk ke notes.js dengan id
  // kalo lebih dari 0 (ada idnya) lalu isSuccess akan bernilai true
  const isSuccess = notes.filter((note) => note.id === id).length > 0;


  if (isSuccess===true) {
    // kalo note berhasil di masukkan
    // akan mengirimkan response status
    // menggunakan response toolkit (h.response)
    // dibuat manual
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil ditambahkan',
      data: {
        // id yang dibuat acak menggunakan nanoid
        noteId: id,
      },
    });
    // detailed notation (seperti opsi lainnya)
    response.code(201);

    return response;
  } else {
    const response = h.response({
      status: 'fail',
      message: 'Catatan gagal ditambahkan',
    });
    response.code(500);
    return response;
  };
};


const getAllNotesHandler = () => ({
  // tampilkan status success
  // dan data berupa semua catatan yang telah dibuat
  status: 'success',
  data: {
    notes,
  },
});


const getNoteByIdHandler = (request, h) => {
  // Ambil id dari request parameter
  // const id = request.params.id
  const {id} = request.params;

  // filter note dengan id yang telah diberikan
  const note = notes.filter((n) => n.id === id)[0];

  // cek apakah note ditemukan atau tidak
  // kalo tidak ditemukan akan undefined
  if (note !== undefined) {
    return {
      status: 'success',
      data: {
        note,
      },
    };
  } else {
    // kalo ga ditemukan notenya
    // pakai response toolkit untuk membuat massage manual
    const response = h.response({
      status: 'fail',
      message: 'Catatan tidak ditemukan',
    });
    response.code(404);

    return response;
  };
};


const editNoteByIdHandler = (request, h) => {
  // dapatkan id
  const {id} = request.params;

  // dapatkan isi body request
  const {title, tags, body} = request.payload;

  // perbarui properti updatedAt
  const updatedAt = new Date().toISOString();

  // ubah note lama dengan yang baru
  // menggunakan findIndex untuk menemukan id
  const index = notes.findIndex((note) => note.id === id);

  // kalo note dengan id ditemukan, index akan bernilai array index dari note
  // kalo ga ketemu, index akan bernilai -1
  if (index !== -1) {
    notes[index] = {
      // spread (...) untuk mempertahankan nilai notes[index]
      // yang tidak perlu diubah (masih kurang paham)
      ...notes[index],
      title,
      tags,
      body,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil diperbarui',
    });
    response.code(200);
    return response;
  } else {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui catatan. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  }
};


const deleteNoteByIdHandler = (request, h) => {
  // dapatkan id dari request
  const {id} = request.params;

  // dapatkan index notesnya dari id yg diberikan
  const index = notes.findIndex((note) => {
    note.id === id;
  });

  // Kalo index (-1) artinya gagal ditemukan
  if (index !== -1) {
    // untuk menghapus notes menggunakan fungsi splice
    // splice("awal item yg dihapus", "jumlah item yg dihapus")
    notes.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil dihapus',
    });
    response.code(200);
    return response;
  } else {
    const response = h.response({
      status: 'fail',
      message: 'Catatan gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  }
};

// export lebih dari 1 pake object {}
module.exports = {
  addNoteHandler,
  getAllNotesHandler,
  getNoteByIdHandler,
  editNoteByIdHandler,
  deleteNoteByIdHandler,
};
