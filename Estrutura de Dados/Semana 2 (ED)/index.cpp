#include <stdio.h>
#include <stdlib.h>

// O molde do nosso Vagão
typedef struct no {
    int info;
    struct no *prox; 
} No;

int main() {
    // Temos 3 chaves (ponteiros), mas os vagões ainda não existem.
    No *vagao1;
    No *vagao2;
    No *vagao3;

    // ==========================================
    // PASSO 1: Use o malloc e o sizeof para alocar memória para os 3 vagões
    // ESCREVA AQUI:
    vagao1 = (struct no *) malloc(sizeof(struct no));
    vagao2 = (struct no *) malloc(sizeof(struct no));
    vagao3 = (struct no *) malloc(sizeof(struct no));
    
    
    // PASSO 2: Use a setinha (->) para colocar uma carga (info) em cada vagão.
    // Ex: vagao1 recebe 10, vagao2 recebe 20, vagao3 recebe 30.
    // ESCREVA AQUI:
     vagao1->info = 10;
     vagao2->info = 20;
     vagao3->info = 30;
    
    
    // PASSO 3: O GRANDE SEGREDO - O ENCADEAMENTO!
    // Você precisa ligar os vagões usando o 'prox'.
    // - O 'prox' do vagao1 deve receber o endereço do vagao2.
    // - O 'prox' do vagao2 deve receber o endereço do vagao3.
    // - O 'prox' do vagao3 deve receber NULL (pois é o fim da linha).
    // DICA: vagao1->prox = vagao2;
    // ESCREVA AQUI:
    vagao1->prox = vagao2;
    vagao2->prox = vagao3;
    vagao3->prox = NULL;
    
    
    // ==========================================

    // Teste Mágico! Se você fez o Passo 3 certo, a linha abaixo VAI FUNCIONAR.
    // Note que eu vou imprimir a carga do vagão 2, mas usando APENAS o vagão 1!
    // Tradução de vagao1->prox->info : "Pegue o vagao1, vá para o próximo, e abra a info dele".
    printf("A carga do vagao 2 eh: %d\n", vagao1->prox->info);
    printf("A carga do vagao 3 eh: %d\n", vagao2->prox->info);

    // ==========================================
    // PASSO 4: Devolva os 3 vagões para o sistema com o free().
    // ESCREVA AQUI:
    free(vagao1);
    free(vagao2);
    free(vagao3);
    
    
    // ==========================================

    return 0;
}