var toDoList = toDoList || {};

toDoList.rigaTabella = toDoList.rigaTabella || {};

toDoList.rigaTabella.creaNuovaRiga = function creaNuovaRiga(titolo, oggetto, stato, dataScadenza) 
{
	var tabellaInsert = toDoList.getTabellaRigheToDo();
	var tBody = tabellaInsert.getElementsByTagName('tbody')[0];

	var id = toDoList.maxId;
	var descStato = toDoList.descrizioneStato[stato].Desc;

	var row = tBody.insertRow();
	this.settaValoriColonne(row.rowIndex,id,titolo, oggetto, descStato,dataScadenza,true);

	var nuovoToDo = { "id" : id, "titolo": titolo, "oggetto" : oggetto, "stato": stato, "dataScadenza" : dataScadenza}
	toDoList.elencoToDo.push(nuovoToDo);

	// dopo aver inserito i datri li cancello, pronti per un nuovo inserimento
	toDoList.rigaTabella.pulisciCampi();

	toDoList.maxId++;
};

toDoList.rigaTabella.settaValoriColonne = function settaValoriColonne(rowIndex, id, titolo, oggetto, descStato, dataScadenza,insert) 
{
	var tabellaInsert = toDoList.getTabellaRigheToDo();
	var row = tabellaInsert.rows[rowIndex];
	
	var tId = insert ? row.insertCell(0) : row.cells[0];
	var tTitolo = insert ? row.insertCell(1): row.cells[1];
	var tStato = insert ? row.insertCell(2): row.cells[2];
	var tDataScadenza = insert ? row.insertCell(3): row.cells[3];
	var tModifica = insert ? row.insertCell(4): row.cells[4];
	var tElimina = insert ? row.insertCell(5): row.cells[5];

	tId.innerHTML = id;
	tTitolo.innerHTML = titolo;
	tStato.innerHTML = descStato;
	tDataScadenza.innerHTML = dataScadenza;	
	tModifica.innerHTML = toDoList.pulsanteModifica(id,row.rowIndex);	
	tElimina.innerHTML = toDoList.pulsanteElimina(id,row.rowIndex);	
}


toDoList.rigaTabella.modificaRiga = function modificaRiga(id, titolo, oggetto, stato, dataScadenza, rowIndex) 
{
	var elencoToDo = toDoList.elencoToDo;

	for (var i = 0; i<elencoToDo.length; i++)
	{
		if(elencoToDo[i].id == id)
		{
			elencoToDo[i].titolo = titolo;
			elencoToDo[i].oggetto = oggetto;
			elencoToDo[i].stato = stato;
			elencoToDo[i].dataScadenza = dataScadenza;
		}
	}

	var descStato = toDoList.descrizioneStato[stato].Desc;
	this.settaValoriColonne(rowIndex,id,titolo,oggetto,descStato,dataScadenza,false);
	toDoList.rigaTabella.pulisciCampi();
}

toDoList.rigaTabella.pulisciCampi = function ()
{
	var campi = document.getElementsByClassName("dati");
	for (var i = 0; i<campi.length; i++)
	{
		campi[i].value = "";
	}
	
	toDoList.setOperazioneAttuale(toDoList.operazioni.inserimento);		
};


toDoList.rigaTabella.selezionaRiga = function selezionaRiga(idRiga) 
{

	var riga = null;
	
	var elencoToDo = toDoList.elencoToDo;

	for (var i = 0; i<elencoToDo.length; i++)
	{
		if(elencoToDo[i].id == idRiga)
		{
			riga = elencoToDo[i];
			break;
		}
	}		
	
	document.getElementById('id').value = riga.id;
	document.getElementById('titolo').value = riga.titolo;
	document.getElementById('oggetto').value = riga.oggetto;
	document.getElementById('stato').value = riga.stato;
	document.getElementById('dataScadenza').value = riga.dataScadenza;
	
	toDoList.setOperazioneAttuale(toDoList.operazioni.modifica);
};


toDoList.rigaTabella.eliminaRiga = function eliminaRiga(idRiga,rowIndex) 
{
    var newToDoList = toDoList.elencoToDo.filter(function(toDo) {
        if (toDo.id == idRiga) {
            return false;
        }
        return true;
    });	
	
	toDoList.elencoToDo = newToDoList;
	toDoList.getTabellaRigheToDo().deleteRow(rowIndex);
	toDoList.setOperazioneAttuale(toDoList.operazioni.inserimento);
}

toDoList.gestisciPulsantiCampi = function gestisciPulsanti()
{
	var nuovaRiga = toDoList.operazioneAttuale == toDoList.operazioni.inserimento; 
	var visibilitaAggiungi =  nuovaRiga ? 'inline-block' : 'none';
	var visibilitaSalva =  nuovaRiga ? 'none' : 'inline-block';
	var visibilitaAnnulla =  nuovaRiga ? 'none' : 'inline-block';
	
	document.getElementById('aggiungi').style.display = visibilitaAggiungi;
	document.getElementById('salva').style.display = visibilitaSalva;
	document.getElementById('annulla').style.display = visibilitaAnnulla;
	
	var campiId = document.getElementsByClassName("id");
	for (var i = 0; i<campiId.length; i++)
	{
		campiId[i].style.display = visibilitaSalva;
	}
	
}

toDoList.setOperazioneAttuale = function setOperazioneAttuale(operazione)
{
	this.operazioneAttuale = operazione;
	this.gestisciPulsantiCampi();
}

toDoList.getTabellaRigheToDo = function ()
{
	return document.getElementById('listaToDo');
};

toDoList.pulsanteModifica = function (id,rowIndex)
{
	var modifica = '<img src="img/modify.png" alt="Modifica" style="cursor: pointer;height: 16px;width: 16px;" alt="Modifica" title="Modifica" onclick="javascript:modificaRigaTabella('+id+',this)" />'
	return modifica;
};

toDoList.pulsanteElimina = function (id,rowIndex)
{
	var bDelete = '<img src="img/delete.png" alt="Elimina" style="cursor: pointer;height: 16px;width: 16px;" alt="Elimna" title="Elimna" onclick="javascript:eliminaRigaTabella('+id+',this)" />'
	return bDelete;
};

toDoList.maxId = 1;
toDoList.elencoToDo = [];
toDoList.operazioneAttuale = "";
toDoList.operazioni = {inserimento: 'inserimento',modifica: 'modifica'};
toDoList.descrizioneStato = [{"Desc" : ""},  {"Desc" : "Inserimento"},{"Desc" : "In elaborazione"},{"Desc" : "Concluso"}];

