import User from '@/models/User';
import {NextResponse} from 'next/server';
import bcrypt from 'bcryptjs'
import connect from '@/utils/db';

export async function POST (req) {
  try {
    const {nome, email, senha} = await req.json ();
    await connect ();
    const emailExists = await User.findOne ({email});

    if (emailExists) {
      return NextResponse.json ({
        message: "Email já cadastrado!",
        status: 489,
      });
    }
    
    const hashedPassord = await bcrypt.hash (senha, 5);

    const newUser = new User ({
      nome,
      email,
      senha: hashedPassord,
    });
    await newUser.save();

    return NextResponse.json({
      message: "Usuário criado com sucesso!",
      status: 201,
    });
  } catch (error) {
    return NextResponse.json ({
      error: "Erro ao cadastrar usuário",
      status: 500,
    });  
  }
}
