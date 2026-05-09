#include <stdio.h>
#include "mochila.h"

void inicializa_mochila (mochila *m) {
    int i;

    for (i = 0; i < MAX_ITENS; i++)
    {
        m->item[i] = -1;
    }
    
}

// ==========================================
// ARQUIVO: mochila.c (Continuando...)
// ==========================================

// MISSÃO 1: O Fiscal de Tamanho (Igual ao 'size' da Sacola)
// Conta quantos itens existem até achar o primeiro -1
int tamanho_mochila(Mochila *m) {
    int i = 0, qtd = 0;
    
    // Faça aquele 'while' com o Cinto de Segurança!
    // 1. Enquanto o 'i' for menor que MAX_ITENS
    // 2. E o m->item[i] for diferente de -1
    // Aumente o 'qtd' e o 'i'.
    // ESCREVA AQUI:
        while (i < MAX_ITENS && m->item = -1)
            {
                qtd++;
                i++;
            }
        
    return qtd;
}

// MISSÃO 2: Guardar o Loot (Igual ao 'insert' da Sacola)
// Retorna 1 se guardou, 0 se a mochila estiver cheia
int guarda_item(Mochila *m, int id_item) {
    
    // 1. Descubra a quantidade atual usando a sua função tamanho_mochila(m)
    // ESCREVA AQUI:   
    int tamanho_mochila(m)
    
    
    // 2. Se a quantidade for igual a MAX_ITENS, retorne 0 (mochila cheia!)
    // ESCREVA AQUI:
    
    
    // 3. Se não estiver cheia, coloque o 'id_item' na gaveta [quantidade]
    // ESCREVA AQUI:
    
    
    return 1; // Sucesso!
}
