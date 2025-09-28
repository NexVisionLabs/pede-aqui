import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import {
    ActivityIndicator, Alert,
    Button,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

interface Produto {
  id: string;
  titulo: string;
  descricao: string;
  preco: string;
  imagem?: string; // URL da imagem (local)
}

export default function CadastroProdutos() {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [imagemUri, setImagemUri] = useState<string | undefined>(undefined);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const escolherImagem = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'É necessário permitir acesso à galeria.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImagemUri(result.assets[0].uri);
    }
  };

  const adicionarProduto = () => {
    if (!titulo || !descricao || !preco) {
      Alert.alert('Erro', 'Preencha todos os campos!');
      return;
    }

    const novoProduto: Produto = {
      id: Date.now().toString(),
      titulo,
      descricao,
      preco,
      imagem: imagemUri,
    };

    setProdutos([...produtos, novoProduto]);
    setTitulo('');
    setDescricao('');
    setPreco('');
    setImagemUri(undefined);
  };

  const enviarParaLambda = async (produtos: Produto[]) => {
    if (enviando) return; 

    try {
        setEnviando(true);

      const agora = new Date().toISOString(); // "receivedAt"
  
      // Transformar os produtos no formato que o Lambda espera (sem imagem)
      const produtosFormatados = produtos.map((produto) => ({
        name: produto.titulo,
        description: produto.descricao,
        price: parseFloat(produto.preco),
        date: new Date().toISOString(), // ou você pode customizar isso
      }));
  
      const payload = {
        domain: "https://nexvisionlabs.github.io/pede-aqui",
        schema: {
          menuTitle: "payload.title",
          items: "payload.products",
          generatedAt: "metadata.receivedAt",
        },
        payload: {
          company: "Madero",
          products: produtosFormatados,
        },
        metadata: {
          receivedAt: agora,
        },
        dateField: agora,
      };
  
      const lambdaEndpoint = "https://44rkqguwnlpzybffi22jdj5z4e0ytcfo.lambda-url.us-east-2.on.aws/";
      const response = await fetch(lambdaEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Erro no envio:", errorText);
        throw new Error(`Erro ao enviar dados: ${response.status}`);
      }
  
      const respostaJson = await response.json();
      console.log("Enviado com sucesso:", respostaJson);
      const { qrCodeImageUrl } = respostaJson;

        // Atualiza o state com a URL da imagem
        setQrCodeUrl(qrCodeImageUrl);

        Alert.alert("Sucesso", "Produtos enviados com sucesso!");
    } catch (error) {
      console.error("Erro ao enviar para Lambda:", error);
      Alert.alert("Erro", "Falha ao enviar produtos.");
    } finally {
        setEnviando(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Título:</Text>
      <TextInput
        style={styles.input}
        value={titulo}
        onChangeText={setTitulo}
        placeholder="Ex: Pizza Margherita"
      />

      <Text style={styles.label}>Descrição:</Text>
      <TextInput
        style={styles.input}
        value={descricao}
        onChangeText={setDescricao}
        placeholder="Ex: Massa fina, molho de tomate, mussarela"
      />

      <Text style={styles.label}>Preço (R$):</Text>
      <TextInput
        style={styles.input}
        value={preco}
        onChangeText={setPreco}
        keyboardType="numeric"
        placeholder="Ex: 39.90"
      />

      <TouchableOpacity onPress={escolherImagem} style={styles.imagePicker}>
        <Text style={styles.imagePickerText}>
          {imagemUri ? 'Alterar Imagem' : 'Selecionar Imagem'}
        </Text>
      </TouchableOpacity>

      {imagemUri && (
        <Image source={{ uri: imagemUri }} style={styles.previewImage} />
      )}

      <Button title="Adicionar Produto" onPress={adicionarProduto} />

      <FlatList
        data={produtos}
        keyExtractor={(item) => item.id}
        style={styles.lista}
        renderItem={({ item }) => (
          <View style={styles.produtoItem}>
            <View style={styles.produtoInfo}>
              <View style={{ flex: 1 }}>
                <Text style={styles.produtoTitulo}>{item.titulo}</Text>
                <Text>{item.descricao}</Text>
                <Text style={styles.produtoPreco}>R$ {item.preco}</Text>
              </View>
              {item.imagem && (
                <Image source={{ uri: item.imagem }} style={styles.produtoImagem} />
              )}
            </View>
          </View>
        )}
      />

    <TouchableOpacity
    onPress={() => enviarParaLambda(produtos)}
    disabled={enviando}
    style={{
        backgroundColor: enviando ? '#ccc' : '#4CAF50',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    }}
    >
    {enviando ? (
        <ActivityIndicator color="#fff" />
    ) : (
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Enviar para o Lambda</Text>
    )}
    </TouchableOpacity>

    {qrCodeUrl && (
        <View style={{ alignItems: 'center', marginTop: 20 }}>
            <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>QR Code do Cardápio:</Text>
            <Image
                source={{ uri: qrCodeUrl }}
                style={{ width: 200, height: 200 }}
                resizeMode="contain"
            />
        </View>
)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  label: {
    marginTop: 10,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 6,
    padding: 8,
    marginBottom: 5,
  },
  imagePicker: {
    backgroundColor: '#444',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 10,
  },
  imagePickerText: {
    color: '#fff',
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 6,
    marginBottom: 10,
    alignSelf: 'center',
  },
  lista: {
    marginTop: 20,
  },
  produtoItem: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    marginBottom: 10,
  },
  produtoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  produtoTitulo: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  produtoPreco: {
    color: 'green',
    marginTop: 5,
  },
  produtoImagem: {
    width: 70,
    height: 70,
    borderRadius: 6,
    marginLeft: 10,
  },
});
