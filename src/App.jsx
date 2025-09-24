import { useState, useEffect } from "react";

function App() {
  const [nome, setNome] = useState("");
  const [ra, setRa] = useState("");
  const [idade, setIdade] = useState("");
  const [sexo, setSexo] = useState("");
  const [media, setMedia] = useState("");
  const [alunos, setAlunos] = useState([]);
  const [alunosExibidos, setAlunosExibidos] = useState([]);
  const [erros, setErros] = useState({});
  const [mensagemSucesso, setMensagemSucesso] = useState("");
  const [ordenacaoAtiva, setOrdenacaoAtiva] = useState(null);

  // Sincroniza a lista exibida com a lista principal de alunos
  useEffect(() => {
    setAlunosExibidos(alunos);
  }, [alunos]);

  function ordena(vetor, fnComp) {
    for (let posSel = 0; posSel < vetor.length - 1; posSel++) {
      let posMenor = posSel;
      for (let i = posSel + 1; i < vetor.length; i++) {
        if (fnComp(vetor[i], vetor[posMenor])) {
          posMenor = i;
        }
      }
      if (posMenor !== posSel) {
        [vetor[posSel], vetor[posMenor]] = [vetor[posMenor], vetor[posSel]];
      }
    }
  }

  function ordenaNomeCrescente() {
    const ordenado = [...alunos];
    ordena(ordenado,(elem1, elem2) => elem1.nome.toLowerCase() < elem2.nome.toLowerCase());
    setAlunosExibidos(ordenado);
    setOrdenacaoAtiva("nome");
  }

  function ordenaRaDecrescente() {
    const ordenado = [...alunos];
    ordena(ordenado, (elem1, elem2) => parseInt(elem1.ra) > parseInt(elem2.ra));
    setAlunosExibidos(ordenado);
    setOrdenacaoAtiva("ra");
  }

  function ordenaNomeCrescenteAprovados() {
    const aprovados = alunos.filter((a) => a.resultado === "Aprovado");
    const ordenado = [...aprovados];
    ordena(ordenado,(elem1, elem2) => elem1.nome.toLowerCase() < elem2.nome.toLowerCase());
    setAlunosExibidos(ordenado);
    setOrdenacaoAtiva("aprovados");
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validação de campos obrigatórios
    const novosErros = {};
    if (!nome) novosErros.nome = "Campo obrigatório";
    if (!ra) novosErros.ra = "Campo obrigatório";
    if (!idade) novosErros.idade = "Campo obrigatório";
    if (!sexo) novosErros.sexo = "Campo obrigatório";
    if (!media) {
      novosErros.media = "Campo obrigatório";
    } else {
      const mediaNumerica = parseFloat(media);
      // Validação de média
      if (
        mediaNumerica < 0 ||
        mediaNumerica > 10 ||
        mediaNumerica !== mediaNumerica
      ) {
        novosErros.media = "A média deve ser um número entre 0 e 10.";
      }
    }

    setErros(novosErros);
    // Se houver algum erro, interrompe o envio do formulário
    if (Object.keys(novosErros).length > 0) {
      setMensagemSucesso(""); // Limpa a mensagem de sucesso se houver erro
      return;
    }

    const nomeNormalizado =
      nome.charAt(0).toUpperCase() + nome.slice(1).toLowerCase();
    const novoAluno = {
      nome: nomeNormalizado,
      ra: ra,
      idade: parseInt(idade),
      sexo,
      media: parseFloat(media),
      resultado: parseFloat(media) >= 6.0 ? "Aprovado" : "Reprovado",
    };

    setAlunos([...alunos, novoAluno]);
    setMensagemSucesso("Aluno cadastrado com sucesso!");
    setTimeout(() => {
      setMensagemSucesso("");
    }, 3000);
    setNome("");
    setRa("");
    setIdade("");
    setSexo("");
    setMedia("");
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-6xl">
      <h1 className="text-4xl font-extrabold text-blue-900 my-8 drop-shadow-md tracking-wide">
        Portal Escolar
      </h1>
      <div className="flex gap-8 w-full max-w-6xl">
        {/*Formulário e Botões de Ordenação */}
        <div className="w-full max-w-md my-4">
          <div className="bg-white shadow-lg rounded-2xl p-8">
            <p className="text-xl font-bold text-gray-700 mb-4 text-center">
              Cadastro de Alunos
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              {mensagemSucesso && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
                  <span className="block sm:inline">{mensagemSucesso}</span>
                </div>
              )}
              <div>
                <label className="block text-gray-600">Nome: </label>
                <input
                  placeholder="Digite seu nome..."
                  value={nome}
                  onChange={(e) => {setNome(e.target.value)
                  if (erros.nome) {
                      setErros({ ...erros, nome: null });
                    }
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                    erros.nome ? "border-red-500 border-2" : "border-gray-300"
                  }`}
                />
                {erros.nome && (<p className="text-red-500 text-sm mt-1">{erros.nome}</p>)}
              </div>
              <div>
                <label className="block text-gray-600">RA: </label>
                <input
                  placeholder="Digite seu RA..."
                  value={ra}
                  onChange={(e) => {setRa(e.target.value)
                    if (erros.ra) {
                        setErros({ ...erros, ra: null });
                    }
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 
                    ${erros.ra ? "border-red-500 border-2" : "border-gray-300"}`}
                />
                {erros.ra && (<p className="text-red-500 text-sm mt-1">{erros.ra}</p>)}
              </div>
              <div>
                <label className="block text-gray-600">Idade: </label>
                <input
                  placeholder="Digite sua idade..."
                  value={idade}
                  onChange={(e) => {setIdade(e.target.value);
                    if (erros.idade) {
                      setErros({ ...erros, idade: null });
                    }
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 
                    ${erros.idade ? "border-red-500 border-2" : "border-gray-300"}`}
                />
                {erros.idade && (<p className="text-red-500 text-sm mt-1">{erros.idade}</p>)}
              </div>
              <div>
                <label className="block text-gray-600">Sexo: </label>
                <select
                  value={sexo}
                  onChange={(e) => {
                    setSexo(e.target.value);
                    if (erros.sexo) {
                      setErros({ ...erros, sexo: null });
                    }
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 
                    ${erros.sexo ? "border-red-500 border-2" : "border-gray-300"}`}
                >
                  <option value="">Selecione...</option>
                  <option value="Feminino">Feminino</option>
                  <option value="Masculino">Masculino</option>
                </select>
                {erros.sexo && (<p className="text-red-500 text-sm mt-1">{erros.sexo}</p>)}
              </div>
              <div>
                <label className="block text-gray-600">Média: </label>
                <input
                  placeholder="Digite a média..."
                  value={media}
                  onChange={(e) => {
                    setMedia(e.target.value);
                    if (erros.media) {
                      setErros({ ...erros, media: null });
                    }
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400
                    ${erros.media ? "border-red-500 border-2" : "border-gray-300"}`}
                />
                {erros.media && (<p className="text-red-500 text-sm mt-1">{erros.media}</p>)}
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition cursor-pointer"
              >
                Adicionar Aluno
              </button>
            </form>
          </div>
        </div>

        {/* Botões de Ordenação e Lista de Alunos */}
        <div className="w-full max-w-md my-4">
          <div className="bg-white shadow-lg rounded-2xl p-8">
            <p className="text-xl font-bold text-gray-700 mb-4 text-center">
              Relatórios de Alunos
            </p>
            <div className="mt-4 mx-3 flex justify-between gap-3">
              <button
                onClick={ordenaNomeCrescente}
                className={`flex items-center bg-blue-200 text-black py-2 px-4 rounded-lg hover:bg-blue-300 transition cursor-pointer
                  ${ordenacaoAtiva === "nome" ? "bg-blue-400 text-white" : ""}`}
              >
                <span className="mr-1">↑</span> Nome
              </button>
              <button
                onClick={ordenaRaDecrescente}
                className={`flex items-center bg-blue-200 text-black py-2 px-4 rounded-lg hover:bg-blue-300 transition cursor-pointer
                  ${ordenacaoAtiva === "ra" ? "bg-blue-400 text-white" : ""}`}
              >
                <span className="mr-1">↓</span> RA
              </button>
              <button
                onClick={ordenaNomeCrescenteAprovados}
                className={`flex items-center bg-blue-200 text-black py-2 px-4 rounded-lg hover:bg-blue-300 transition cursor-pointer
                  ${ordenacaoAtiva === "aprovados"? "bg-blue-400 text-white": ""}`}
              >
                <span className="mr-1">↑</span> Aprovados
              </button>
            </div>
            <div className="mt-8 w-full max-w-md space-y-4">
              {alunosExibidos.length === 0 ? (
                <div className="text-center text-gray-500 text-sm">
                  Nenhum aluno cadastrado. Adicione o primeiro para ver a lista.
                </div>
              ) : (alunosExibidos.map((aluno, index) => (
                  <div
                    key={index}
                    className="bg-white shadow-md rounded-lg p-4 border border-gray-200 transition-shadow duration-300 hover:shadow-lg"
                  >
                    <h2 className="text-lg font-semibold text-gray-700">
                      {" "}
                      {aluno.nome}
                    </h2>
                    <div className="mt-2 text-sm text-gray-600 space-y-1">
                      <p>
                        <span className="font-medium">RA:</span> {aluno.ra}
                      </p>
                      <p>
                        <span className="font-medium">Idade:</span>{" "}
                        {aluno.idade}
                      </p>
                      <p>
                        <span className="font-medium">Sexo:</span> {aluno.sexo}
                      </p>
                      <p>
                        <span className="font-medium">Média:</span>{" "}
                        {aluno.media}
                      </p>
                      <p>
                        <span className="font-medium">Resultado: </span>
                        <span className="font-medium">{aluno.resultado}</span>
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;