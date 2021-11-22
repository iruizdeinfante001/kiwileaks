![KiwiLeaks](https://gateway.pinata.cloud/ipfs/QmXqenbNRsLPLpgU4XPs3hzWGJmnaDLt8USQJ7MbiZVjgb)

# Caso de uso
Pese a que todo el mundo conoce WikiLeaks, organización que se ocupa de publicar documentos sensibles de interés público filtrados, es necesario un proyecto que publique lo que realmente debería preocupar al mundo: los secretos de todo lo que rodea a la industria del kiwi! Los gobiernos de los mayores países productores de kiwi ocultan la verdad que hay detrás de esta fruta.

WikiLeaks ya sufrió ataques y censuras, dado que la web en la que se publicaban las filtraciones necesitaba estar albergada en un servidor, y las donaciones al proyecto se realizaban por lo métodos tradiciones de los pagos online. KiwiLeaks será un proyecto que se desarrollará en la Web 3.0, en la red de Ethereum, evitando así la censura y los ataques, y permitiendo que el público general contribuya al proyecto mediante donaciones que no están sujetas a las normas de las autoridades monetarias.

# Diseño de la solución
El proyecto se basará principalmente en un smart contract (KiwiLeaks.sol) para gestionar la publicación y despublicación de filtraciones, y el envío de donaciones. Y otro smart contract (KWC.sol) para la creación de un token ERC20, el Kiwicoin (KWC), con el que recompensar a los donantes.

## KiwiLeaks.sol

En este smart contract se almacenarán las filtraciones, como cadenas de texto, y se permitirá hacer donaciones.

### Variables de estado:

 - **MAX_LEN**: Constante que indica el número máximo de caracteres en cada filtración.

 - **DECIMALS**: Constante que indica el número de decimales de un token ERC20.
	 
 - **_owner**: Propietario del contrato. Será la dirección que tendrá permitido publicar y despublicar filtraciones, y la dirección a la que se mandará el valor de las donaciones.
	 
 - **_KWCcontract**: Referencia al token KWC. Se usará para transferir tokens a los donantes.
	 
 - **_leaksHashes**: Array que contendrá los hashes de las filtraciones.
	 
 - **_leaks**: Mapa que relaciona el hash de una filtracion con su filtración correspondiente. Es la variable de estado que contendrá las filtraciones.

### Métodos:

 - **Constructor( *KWCtoken* )**: Inicializa la variable _owner con a dirección desde la que se despliegue el contrato y la variable _KWCcontract con la dirección del parámetro de entrada *KWCtoken*.
	 
 - **getMaxLen()**: Getter de la variable MAX_LEN.
	 
 - **publishLeak( *leakString* )**: Publica una nueva filtración, con la cadena de texto *leakString*, si no estaba previamente publicada.
	 
 - **unpublishLeak( *hash* )**: Despublica la filtración identificada por el hash *hash* si está publicada.
	 
 - **getLeaks()**: Devuelve un array con las filtraciones publicadas.
	 
 - **getLeakByHash( *hash* )**: Devuelve la filtración correspondiente al hash *hash*, si existe y está publicada.
	 
 - **availableKWC()**: Devuelve el numero de tokens KWC poseídos por el contrato.

 - **donate()**: Acepta ETH, los envía a la dirección _owner, y transfiere tokens KWC a la dirección desde la que se llama al método.

### Modificadores:

 - **onlyOwner()**: Verifica que dirección desde la que se llama al método sea _owner.

### Estructuras:

Internamente las filtraciones se almacenarán usando la siguiente estructura:

 - **Leak**
	 - **text**: Texto de la filtración
	 - **date**: Fecha de publicación de la filtración
	 - **isPublic**: estado publicado/despublicado

### Eventos:

 - **LeakPublished( bytes32 )**: Se usa para informar de la publicación de una filtración. Emite el hash de la filtración. 
	 
 - **LeakUnpublished( bytes32 )**: Se usa para informar de la despublicación de una filtración. Emite el hash de la filtración. 

## KWC.sol

Se utilizará el modelo de token ERC20 de OpenZeppelin para hacer este smart contract, sin hacer ninguna modificación.

En el momento del despliegue del contrato se preminarán 21M de tokens KWC para la dirección desde la que se despliegue el contrato.

# Compilación y despliegue
Para compilar y desplegar los contratos se usará el editor Remix. Los pasos para el despliegue son los siguientes:

 1. Desplegar KWC.sol y guardar la dirección del contrato.
 2. Desplegar KiwiLeaks.sol, aportando la dirección del contrato desplegado en el primer paso.
 3. Transferir tokens KWC al contrato desplegado en el segundo paso, para permitir recibir donaciones.

# Mejoras planeadas

 - Modificar KiwiLeaks.sol para guardar el hash de un archivo de IPFS en vez de guardar el texto de la filtración en bruto.
