module.exports.validateRegisterInput = (
  username,
  email,
  password,
  confirmPassword,
  name,
  usernameCheck
) => {
  const errors = {};
  if (username.trim() === "") {
    errors.username = "username cant be empty";
  }
  if (email.trim() === "") {
    errors.email = "Email cant be empty";
  } else {
    const regEx =
      /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
    if (!email.match(regEx)) {
      errors.email = "email must be a valid email address";
    }
  }
  if (password === "") {
    errors.password = "password cant be empty";
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "password must match";
  }
  if (name.trim() === "") {
    errors.name = "name cant be empty";
  }
  if (usernameCheck) {
    errors.username = "username already taken";
  }
  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

module.exports.validateLoginInput = (username, password) => {
  const errors = {};
  if (username.trim() === "") {
    errors.username = "username cant be empty";
  }
  if (password.trim() === "") {
    errors.password = "password cant be empty";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

module.exports.validateCustomerInput = (input, checkNama) => {
  const { nama, alamat, notlp, email } = input;
  const errors = {};

  if (nama != null) {
    if (nama.trim() === "") {
      errors.nama = "nama tidak boleh kosong";
    }
  }
  if (alamat != null) {
    if (alamat.trim() === "") {
      errors.alamat = "alamat tidak boleh kosong";
    }
  }
  if (notlp != null) {
    if (notlp.trim() === "") {
      errors.notlp = "nomor telepon tidak boleh kosong";
    }
  }
  if (email != null) {
    if (email.trim() === "") {
      errors.email = "Email tidak boleh kosong";
    } else if (email) {
      const regEx =
        /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
      if (!email.match(regEx)) {
        errors.email = "harus berupa email yang valid";
      }
    }
  }
  if (checkNama) {
    console.log(checkNama);
    errors.nama = "nama customer sudah ada";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

module.exports.validateWorkerInput = (input, checkNama) => {
  const { nama, alamat, notlp, email } = input;
  const errors = {};

  if (nama != null) {
    if (nama.trim() === "") {
      errors.nama = "nama tidak boleh kosong";
    }
  }
  if (alamat != null) {
    if (alamat.trim() === "") {
      errors.alamat = "alamat tidak boleh kosong";
    }
  }
  if (notlp != null) {
    if (notlp.trim() === "") {
      errors.notlp = "nomor telepon tidak boleh kosong";
    }
  }
  if (email != null) {
    if (email.trim() === "") {
      errors.email = "Email tidak boleh kosong";
    } else if (email) {
      const regEx =
        /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
      if (!email.match(regEx)) {
        errors.email = "harus berupa email yang valid";
      }
    }
  }
  if (checkNama) {
    errors.nama = "username already taken";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

module.exports.validateProjectInput = (
  nama,
  alamat,
  namaCustomer,
  startAt,
  endAt
) => {
  const errors = {};
  let tanggalMulai, tanggalSelesai;

  if (nama.trim() === "") {
    errors.nama = "nama tidak boleh kosong";
  }
  if (alamat.trim() === "") {
    errors.alamat = "alamat tidak boleh kosong";
  }
  if (namaCustomer.trim() === "") {
    errors.namaCustomer = "alamat tidak boleh kosong";
  }
  if (startAt != null) {
    tanggalMulai = new Date(startAt).toISOString();
  }
  if (endAt != null) {
    tanggalSelesai = new Date(endAt).toISOString();
  }
  if (tanggalMulai > tanggalSelesai) {
    errors.tanggal =
      "tanggal selesai tidak boleh lebih dulu dari tanggal mulai";
  }
  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

module.exports.validateUpdateProjectInput = (input) => {
  const { nama, alamat, namaCustomer, startAt, endAt } = input;
  const errors = {};
  let tanggalMulai, tanggalSelesai;

  if (nama != null) {
    if (nama.trim() === "") {
      errors.nama = "nama tidak boleh kosong";
    }
  }
  if (alamat != null) {
    if (alamat.trim() === "") {
      errors.alamat = "alamat tidak boleh kosong";
    }
  }
  if (namaCustomer != null) {
    if (namaCustomer.trim() === "") {
      errors.namaCustomer = "nama customer tidak boleh kosong";
    }
  }
  if (startAt != null) {
    tanggalMulai = new Date(startAt).toISOString();
  }
  if (endAt != null) {
    tanggalSelesai = new Date(endAt).toISOString();
  }
  if (tanggalMulai > tanggalSelesai) {
    errors.tanggal =
      "tanggal selesai tidak boleh lebih dulu dari tanggal mulai";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

module.exports.validatePresenceInput = (tanggal) => {
  const errors = {};

  if (tanggal.trim() === "") {
    errors.tanggal = "tanggal absen tidak boleh kosong";
  } else {
    const regEx =
      /([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})/;

    if (!tanggal.match(regEx)) {
      errors.tanggal = "harus berupa tanggal yang valid";
    }
  }
  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

module.exports.validateTaskInput = (input, projectStartAt, projectEndAt) => {
  const errors = {};
  const { nama, startAt, endAt } = input;
  let tanggalMulai, tanggalSelesai;

  if (nama != null) {
    if (nama.trim() === "") {
      errors.nama = "nama tidak boleh kosong";
    }
  }
  if (startAt != null) {
    tanggalMulai = new Date(startAt).toISOString();
  }
  if (endAt != null) {
    tanggalSelesai = new Date(endAt).toISOString();
  }
  if (tanggalMulai > tanggalSelesai) {
    errors.tanggal =
      "tanggal selesai tidak boleh lebih dulu dari tanggal mulai";
  }
  if (projectStartAt != null && projectEndAt != null) {
    if (
      tanggalMulai < projectStartAt ||
      tanggalMulai > projectEndAt ||
      tanggalSelesai < projectStartAt ||
      tanggalSelesai > projectEndAt
    ) {
      errors.tanggalProject =
        "tanggal pekerjaan tidak boleh melebihi durasi project";
    }
  }
  return { errors, valid: Object.keys(errors).length < 1 };
};

module.exports.validateMaterialInput = (input) => {
  const errors = {};
  const { nama, jumlah } = input;

  if (nama != null) {
    if (nama.trim() === "") {
      errors.nama = "nama tidak boleh kosong";
    }
  }
  if (jumlah != null) {
    if (jumlah < 1) {
      errors.jumlah = "jumlah tidak boleh kosong";
    }
  }
  return { errors, valid: Object.keys(errors).length < 1 };
};

module.exports.validateToolInput = (input) => {
  const errors = {};
  const { nama, jumlah } = input;

  if (nama != null) {
    if (nama.trim() === "") {
      errors.nama = "nama tidak boleh kosong";
    }
  }
  if (jumlah != null) {
    if (jumlah < 1) {
      errors.jumlah = "jumlah tidak boleh kosong";
    }
  }
  return { errors, valid: Object.keys(errors).length < 1 };
};
