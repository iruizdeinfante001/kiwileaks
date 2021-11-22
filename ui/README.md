# Interfaz de usuario
Para facilitar el acceso a la información publicada por KiwiLeaks en la red de Ethereum se ha creado un front end web, mediante el uso de la tecnología Web3.

### Formas de uso
Este front end está pensado para ser usado junto a Metamask. En función de como se conecte el usuario existen tres roles para usar la aplicación:

 - Editor:

	Si la persona que se conecta al front end lo hace usando la red en la que se encuentra desplegado el contrato KiwiLeaks.sol, y con la dirección del propietario del contrato, dispondrá de la opción de publicar nuevas filtraciones y de despublicar filtraciones de manera individual. Podrá ver la lista de todas las filtraciones publicadas.

 - Donante:

	Si la persona que se conecta al front end lo hace usando la red en la que se encuentra desplegado el contrato KiwiLeaks.sol, y con una dirección que no sea propietaria del contrato, dispondrá de la opción de donar al proyecto a cambio de KWC. Podrá ver la lista de todas las filtraciones publicadas.

 - Usuario genérico:

	Si la persona que se conecta al front end lo hace sin usar Metamask, o se conecta a una red distinta a aquella en la que se encuentra desplegado el contrato KiwiLeaks.sol, podrá ver la lista de todas las filtraciones publicadas (la aplicación se conectará a un nodo ofrecido por Infura), pero no podrá realizar ningún otro tipo de acción.

### Eventos
La aplicación escucha los eventos generados por los contratos KiwiLeaks.sol y KWC.sol para actualizar el contenido mostrado, de manera que la actualización de la información sea constante y sin necesidad de que los usuarios recarguen la página.

### Distribución y disponibilidad
El front end se podría distribuir como una página HTML estática, y ser visualizada como un archivo local en el navegador. Pero, dado que Metamask no inyecta Web3 en los archivos locales, solo se podrían ver la filtraciones, sin opción a poder publicar/despublicar filtraciones ni de realizar donaciones. Por lo tanto es necesario servir la aplicación desde internet.

Para ello el front end, y otros recursos necesarios, estarán disponiblen como archivos en IPFS. De esta manera también evitamos que se pueda limitar el acceso de manera directa a la aplicación, al no depender de servicios de alojamiento web tradicionales.
