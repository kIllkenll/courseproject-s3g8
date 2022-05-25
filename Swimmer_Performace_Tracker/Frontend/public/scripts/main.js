

const apiURL = "http://localhost:3000/api/";

/** namespace. */
var rhit = rhit || {};

/** globals */
rhit.variableName = "";

rhit.compareChart = null;
rhit.created = false;
rhit.createdComparison = false;
rhit.barChart = null;
rhit.progressChart = null;
rhit.fbSwimmerDetailManager = null;
rhit.fbSwimmerPageController = null;

rhit.fbHomePageController = null;

rhit.userID = null;

rhit.changeTable = true;

rhit.fbDatahubPageController = null;

rhit.fbDatahubPageManager = null;

rhit.fbregPageManager = null;

rhit.fbLoginpageManager = null;

rhit.fbTrackerManager = null;

rhit.fbcomparisonManager = null;

rhit.fbImprovementPageManager = null;

/** function and class syntax examples */
rhit.functionName = function () {
	/** function body */
};



rhit.FbImprovementPageController = class{
	constructor(){
		let id = sessionStorage.getItem('ID');
		let racename = sessionStorage.getItem('racename');
		
		rhit.fbImprovementPageManager.loadLast7Days(id, racename, this.updatePage.bind(this));
		rhit.fbImprovementPageManager.getQualifyingTime(this.updateDetail.bind(this));
	}

	updateDetail(){
		let timeData = rhit.fbImprovementPageManager.getTimeData();
		console.log(timeData);
		let selectMeet = document.querySelector("#selectMeet")

		for (var i = 0; i < timeData.length; i++) {
			var option = document.createElement("option");
			option.value = timeData[i].meetname;
			option.text = timeData[i].meetname;
			selectMeet.appendChild(option);
		}

		// let runBtn = document.querySelector("#qtBtn").addEventListener("click",(event)=>{
			
		// });
		
		
	}


	updatePage(){
		let raceData = rhit.fbImprovementPageManager.getData();
		

		

		
		let ds = [];
		let label = [];
		for(let i = 1; i < raceData.length; i++){
			
			let current = rhit.convertToSeconds(raceData[i].racetime);
			let prev = rhit.convertToSeconds(raceData[i-1].racetime);
			let improvement = prev - current;
			improvement = (improvement/current) * 100
			let newDate = raceData[i].meetdate.split("T");
			let x = raceData[i].meetname + " "+ newDate[0];
			const data = {xAxis: x, improvement:{user: improvement}}
			ds.push(data);
			label.push(x);
		}

		
		const ctx = document.querySelector("#progressChart").getContext('2d');
		const gradientBg = ctx.createLinearGradient(0,0,0,250);

		gradientBg.addColorStop(0,'lime');
		gradientBg.addColorStop(0.5,'orange');
		gradientBg.addColorStop(1,'red');
			const data = {
				labels: label,
				datasets: [{
				  label: `Improvement(%)`,
				  data: ds,
				  backgroundColor:gradientBg,
				  
				borderWidth: 4,
				  borderColor: gradientBg,
				  
				  tension:0.5,
				  parsing:{
					  xAxisKey: 'xAxis',
					  yAxisKey: 'improvement.user'
	
				  }
	
				}
				
			]
			  };
			
			  var config = {
				  type:"line",
				  data: data,
				  
				  options: {
					  
					scales: {
					  y: {
						beginAtZero: true
					  }
					},
					
				  },
			  }

			  rhit.progressChart = new Chart(ctx,config)

			  rhit.progressChart.canvas.parentNode.style.height = '300px';
			  rhit.progressChart.canvas.parentNode.style.width = '500px';

	}


	
}


rhit.FbImprovementPageManager = class{
	constructor(){
		this._documentSnapshots = null;
		this._documentSnapshots2 = null;
	}

	loadLast7Days(id, racename, call_back){
		return fetch(apiURL+"raceWithinWeek"+"/"+id+"/"+racename).then(response => response.json()).then((data) => {
			this._documentSnapshots = data.result;
			console.log(this._documentSnapshots);
			call_back();
		}).catch((err) => {
			console.log(err);
		});
	}

	getQualifyingTime(call_back){
		let racename = sessionStorage.getItem("racename");
		return fetch(apiURL+"qt"+"/"+racename).then(response => response.json()).then((data) => {
			this._documentSnapshots2 = data.result;
			call_back();
		}).catch((err) => {
			console.log(err);
		});
	}

	getTimeData(){
		let time = []
		
		for(let i = 0 ; i < this._documentSnapshots2[0].length; i++){

			const c = {"meetname":this._documentSnapshots2[0][i].MeetName, "qualifyingtime":this._documentSnapshots[0][i].QualifyingTime}
			time.push(c);
			console.log(c);
			
		}
		return time;
	}


	getData(){
		let data = [];
		
		for(let i = 0; i < this._documentSnapshots[0].length; i++){
			const c = {"racename":this._documentSnapshots[0][i].RaceName, "racetime":this._documentSnapshots[0][i].RaceTime, 
			"meetname": this._documentSnapshots[0][i].MeetName, "meetdate": this._documentSnapshots[0][i].MeetDate};
			
			data.push(c);

		}

		return data;
	}



}

rhit.FbTrackerPageController = class{
	constructor(){
		if(document.querySelector("#trackerPage")){
			let addraceBtn = document.querySelector("#addRaceBtn");

			addraceBtn.addEventListener("click",(event)=>{
				let raceName = document.querySelector("#raceName").value;
				let age = sessionStorage.getItem("age");
				console.log("age"+age);
				let raceTime = document.querySelector("#raceTime").value;
				let meetName = document.querySelector("#meetName").value;
				let meetDate = document.querySelector("#meetDate").value;
				let personID = sessionStorage.getItem('ID');

				
				rhit.fbTrackerManager.addRace(personID, raceName,raceTime, meetName, meetDate, age)
			});
		}
	}

	updatePage(){
		// let addBtn = document.querySelector("#addBtn").addEventListener("click",(event)=>{
		// 	document.querySelector("myForm").style.display = "block";
		// });
		
	}
}








rhit.FbTrackerPageManager = class{
	constructor(){
		
	}



	addRace(personID, racename,racetime, meetname, meetdate, age){
		let data = {
			"personID":personID,
			"raceName":racename,
			"age":age,
			"racetime":racetime,
			"meetname":meetname,
			"meetdate":meetdate
		}

		
		fetch(apiURL+"addRace",{
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data)
		}).then(response => response.json()).then((data) => {
			alert("Race Added Successfully");

		}).catch((err) => {
			alert(`add race failed.`)
		});
	}
}

rhit.FbregPageController = class{
	constructor(){
		
		if(document.querySelector("#registerPage")){
			let registBtn = document.querySelector("#regBtn");
			registBtn.addEventListener("click",(event)=>{
				let fname = document.querySelector("#fname").value;
				let lname = document.querySelector("#lname").value;
				let mname = document.querySelector("#mname").value;
				let username = document.querySelector("#username").value;
				let dob = document.querySelector("#dob").value;
				let gender = document.querySelector("#gender").value;
				let password = document.querySelector("#passw").value;
				let height = document.querySelector("#height").value;
				let weight = document.querySelector("#weight").value;
				
				rhit.fbregPageManager.register(fname, lname, mname, dob, gender, username, password, height, weight);
			});
		}
	}

}

rhit.FbregPageManager = class{
	constructor(){
		this._user = null;
	}

	register(fname, lname, mname, dob, gender, username, password, height, weight){
		let data = {
			"fname": fname, "username": username, "password": password
			, "lname": lname, "dob": dob, "gender":gender, "mname":mname,
			"height":height, "weight":weight
		};

		fetch(apiURL+"register",{
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data)
		}).then(response => response.json()).then((data) => {
			this._user = data.username;
			window.location.href = "index.html";
		}).catch((err) => {
			alert(`Register failed.`)
		});
	}
}



rhit.FbLoginPageController = class{
	constructor(){
		

		if(document.querySelector("#loginpage")){
			let loginBtn = document.querySelector("#loginBtn");
			
			
			loginBtn.addEventListener("click",(event)=>{
				let username = document.querySelector("#usr").value;
				let password = document.querySelector("#pwd").value;
				rhit.fbLoginpageManager.login(username, password);
			});
		}
	}

	// updateDetails(){
		
	// }
}

rhit.FbLoginpageManager = class{
	constructor(){
		
		this.returned = null;
	}

	login(username, password){
		let data = {
			"user":username, 
			"password":password
		}

		fetch(apiURL+"login",{
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data)
		}).then(response => response.json()).then((result) => {
			
			this.returned = result;
			if(this.returned.success){
				sessionStorage.setItem('ID', result.ID);
				this.currentUserID = result.ID;
				console.log(this.currentUserID);
				window.location.href = "homepage.html";
			}else{
				alert("Login unsuccessful");
			}
		}).catch((err) => {
			alert(`login failed.`)
		});
		
	}

	getcurrentUserID() { return sessionStorage.getItem('ID'); }
}


rhit.FbHomePageController = class{
	constructor(){
		let id = sessionStorage.getItem('ID');
		this.localProfile = new rhit.FbSwimmerDetailManager(id);
		this.localProfile.loadSwimmer(this.updatePage.bind(this));
		
	}

	updatePage(){
		let age = this.localProfile.findAge();
		sessionStorage.setItem("age",age);
	}
}


rhit.FbSwimmerDetailManager = class{
	constructor(id){
		this._id = id;
		this._documentSnapshot = null;
	}



	loadSwimmer(call_back){

		
		console.log(this._id);
		return fetch(apiURL+"swimmer/id/"+this._id).then(response => response.json()).then((data) => {
			this._documentnapshot = data.result;
			console.log(this._documentnapshot);
			
			call_back();
			
		}).catch((err) => {
			console.log(err);
		});
	}


	findLastName(){
		return this._documentnapshot.LastName;
	}

	findFirstName(){
		return this._documentnapshot.FirstName;
	}

	findAge(){
		return this._documentnapshot.Age;
	}

	findHeight(){
		return this._documentnapshot.Height;
	}

	findWeight(){
		return this._documentnapshot.Weight;
	}


}

rhit.FbSwimmerPageController = class{
	constructor(){
		rhit.fbSwimmerDetailManager.loadSwimmer(this.updateProfile.bind(this));
	}

	updateProfile(){
		const nameElem = document.querySelector("#name");
		let name = rhit.fbSwimmerDetailManager.findFirstName() +" "+ rhit.fbSwimmerDetailManager.findLastName();
		nameElem.innerHTML += name;
		
		const ageElem = document.querySelector("#Age");
		let age = rhit.fbSwimmerDetailManager.findAge();
		sessionStorage.setItem("age",age);
		ageElem.innerHTML += age;

		const heightElem = document.querySelector("#Height");
		let height = rhit.fbSwimmerDetailManager.findHeight() + "cm";
		heightElem.innerHTML += height;


		const weightElem = document.querySelector("#Weight");
		let weight = rhit.fbSwimmerDetailManager.findWeight() + "lb";
		weightElem.innerHTML += weight;
	}
}


rhit.FbcomparisonManager = class{
	constructor(){
		this._documentSnapshots = null;
		this._userSize = 0;
	
	}

	getComparison(swimmerID, racename, profID, call_back){
		return fetch(apiURL+"comparisonData/"+swimmerID+"/"+racename+"/"+profID).then(response => response.json()).then((data) => {
			this._documentSnapshots = data.result;
			call_back();
		}).catch((err) => {
			console.log(err);
		});
	}

	getComparisonData(){
		let data = [];
		let ID = sessionStorage.getItem("ID");
		//console.log("racename A"+racename);
		let counter = 0;
		for(let i = 0 ; i < this._documentSnapshots[0].length ; i++){
			const c = {"meetName":this._documentSnapshots[0][i].MeetName, "meetDate":this._documentSnapshots[0][i].MeetDate
						,"time":this._documentSnapshots[0][i].RaceTime, "id":this._documentSnapshots[0][i].swimmerID}



			if(this,this._documentSnapshots[0][i].swimmerID == ID){
				counter+=1;
			}

			data.push(c);

		}
		this._userSize = counter;

		return data;
	}

	getSize(){
		return this._userSize;
	}


	loadProfSwimmerRace(swimmerID, age, racename, call_back){
		
		return fetch(apiURL+"profSwimmer/"+swimmerID+"/"+age+"/"+racename).then(response => response.json()).then((data) => {
			this._documentSnapshots = data.result;
			
			call_back();
		}).catch((err) => {
			console.log(err);
		});
	}

	getData(){
		return this._documentSnapshots[0];
	}

	getAllTime(){
		let size = this._documentSnapshots[0].length

		let races = new Array(this._documentSnapshots[0].length);

		for(let i = 0 ; i < size; i++){
			races[i] = (this._documentSnapshots[0][i].RaceTime)
		}

		return races;
		//here
	}

	getAllMeetName(){
		let meetnames = new Array(this._documentSnapshots[0].length);
		
		for(let i = 0 ; i < this._documentSnapshots[0].length; i++){
		
			//onsole.log(this._documentSnapshots[0][i]);
			meetnames[i] = this._documentSnapshots[0][i].MeetName;
		}

		return meetnames;
	}

	

	getAllMeetDate(){
		let meetDate = new Array(this._documentSnapshots[0].length);

		for(let i = 0 ; i < this._documentSnapshots[0].length; i++){
			meetDate[i] = this._documentSnapshots[0][i].MeetDate;
		}
		return meetDate;
	}
}

rhit.convertToSeconds= function(inputTime){
	let uTime = inputTime.split("T");
	uTime = uTime[1].split(":");
	
	let totalSec = parseFloat(uTime[1])*60+parseFloat(uTime[2].substring(0,2));
	return totalSec;
}

rhit.FbDatahubPageController = class{
	constructor(){
		let age = sessionStorage.getItem("age");

		document.querySelector("#nextPage").addEventListener("click",(event)=>{
			let racename = document.querySelector("#racename").value;
			sessionStorage.setItem("racename",racename);
			window.location.href = `improvementTarget.html`;
		});


		let racename = document.querySelector("#racename").value;
		let profID = document.querySelector("#profSwimmer").value;
		let id = sessionStorage.getItem("ID");
		//rhit.fbcomparisonManager.getComparison(id, racename,profID,this.updateDetails.bind(this));

		if(document.querySelector("#datahubPage")){
						let table = document.querySelector("#comparisonTable");
						let compareChart = document.querySelector("#chartContainer");
						let changeViewBtn = document.querySelector("#changeViewBtn");
						changeViewBtn.addEventListener("click",(event)=>{
						if(table.style.display == "none"){
							table.style.display = "block";
							compareChart.style.display = "none";
							changeViewBtn.innerHTML = "Graph View"
							
						}else{
							table.style.display = "none";
							compareChart.style.display = "block";
							changeViewBtn.innerHTML = "Table View"
							
							//rhit.createdComparison = true;
						}
						
		});

				
				let changedSwimmer = false;
				document.querySelector("#racename").addEventListener("change",(event)=>{
					changedSwimmer = true;
				});



			let searchBtn = document.querySelector("#search");
			searchBtn.addEventListener("click",(event)=>{
				let racename = document.querySelector("#racename").value;
				console.log("racename", racename);
				let swimmerID = document.querySelector("#profSwimmer").value;
				if(changedSwimmer){
					rhit.changeTable = true;
				}
			
				
				rhit.fbcomparisonManager.getComparison(id, racename,profID,this.updateDetails.bind(this));
				console.log(rhit.changeTable);
				
			});
			
		}



	

	}

	updateDetails(){
		let comparisonData = rhit.fbcomparisonManager.getComparisonData();
		//console.log("comparisonData"+comparisonData);
		let table = document.querySelector("#comparisonTable");
			for(var i = 1;i<table.rows.length;){
            table.deleteRow(i);
        }

		let id = sessionStorage.getItem("ID");

		let pData =[];
		let uData = [];

		for(let i = 0; i < comparisonData.length; i++){
			if(comparisonData[i].id == id){
				uData.push(comparisonData[i]);
			}else{
				if(comparisonData[i].time != "1970-01-01T00:00:00.000Z"){
					pData.push(comparisonData[i]);
				}
				
			}
		}
			for(var i = 1;i<table.rows.length;){
            table.deleteRow(i);
        }

	
					for(let i = 0 ; i < uData.length; i++){
						
							let row = table.insertRow(-1);
							let cell1 = row.insertCell(0);
							let cell2 = row.insertCell(1);
							let cell3 = row.insertCell(2);
							let cell4 = row.insertCell(3);
							let cell5 = row.insertCell(4);

							let cell6 = row.insertCell(5);
							let cell7 = row.insertCell(6);

							cell1.innerHTML = i+1;

							let uTime = uData[i].time.split("T");
							uTime = uTime[1].split(":");
							console.log(uTime);

							if(uTime[1] != "00"){
								cell2.innerHTML = uTime[1]+ " mins "+ uTime[2].substring(0, 2) +" seconds"; 
							}else{
								cell2.innerHTML = uTime[2].substring(0, 2) +" seconds";
							}

							let pTime = pData[i].time.split("T");
							pTime = pTime[1].split(":");
							
							if(pTime[1] != "00"){
								cell3.innerHTML = pTime[1]+ " mins "+ pTime[2].substring(0, 2) +" seconds"; 
							}else{
								cell3.innerHTML = pTime[2].substring(0, 2) +" seconds";
							}
							let parsedDate = uData[i].meetDate.split("T");
							cell4.innerHTML = uData[i].meetName;
							cell5.innerHTML = parsedDate[0];
							let parsedDate2 = pData[i].meetDate.split("T");
							cell6.innerHTML = pData[i].meetName;
							cell7.innerHTML = parsedDate2[0];
							//cell1.innerHTML = i;
					}

	const userRacetime = []

			const labels = [];
			let parsedDate = [];
			let timeByDate = [];

			for(let i = 0; i < uData.length && i < pData.length; i++){
				
				let uTime = rhit.convertToSeconds(uData[i].time);

				let pTime = rhit.convertToSeconds(pData[i].time);

				console.log("uTime: "+uData[i].time  +" "+ uTime);
				console.log("pTime: "+pData[i].time  +" "+ pTime);

				let d = "race: " + (i+1);
			
				const u = {date: d, racetime: {user: uTime, professionalSwimmer: pTime} }
				labels.push(u);
				userRacetime.push(u);

				let date = uData[i].meetDate.split("T");
			
				timeByDate.push({"racetime":uTime, "meetdate":date[0]});
				parsedDate.push(date[0])
			}

			console.log("time by date"+timeByDate);
			
	
			const ctx = document.querySelector("#comparisonChart");
			const data = {
				// labels: labels,
				datasets: [{
				  label: `Your Swim Time (Seconds)`,
				  data: userRacetime,
				  backgroundColor:[
					'rgba(0, 0, 0, 0.5)'
				  ],
					borderWidth: 4,
				  borderColor: [
					'rgb(0,128,0)'
					
				  ],
				  tension:0.4,
				  parsing:{
					  xAxisKey: 'date',
					  yAxisKey: 'racetime.user'
	
				  }
	
				},
				
				{
					label: `Professional Swimmer Time (Seconds)`,
					data: userRacetime,
					backgroundColor:'rgba(0, 0, 0, 0.5);',
					borderColor: 'rgb(0,0,255)',
					tension:0.4,
					borderWidth: 4,
					parsing:{
						xAxisKey: 'date',
						yAxisKey: 'racetime.professionalSwimmer'
	  
					},
					
					
	  
				  }]
			  };
			
			  var config = {
				  type:"line",
				  data: data,
				  
				  options: {
					scales: {
					  y: {
						beginAtZero: true
					  }
					},
				  },
			  }


			  //rhit.comparisonChart = new Chart(ctx,config)

			  if(rhit.createdComparison){
							// document.getElementById("barChart").remove();
							rhit.comparisonChart.destroy();
							rhit.createdComparison = false;
						}else if(rhit.createdComparison == false){
							rhit.comparisonChart = new Chart(ctx,config)
							rhit.comparisonChart.canvas.parentNode.style.height = '300px';
							rhit.comparisonChart.canvas.parentNode.style.width = '50%';
							rhit.comparisonChart.canvas.parentNode.style.margin = 'auto';
							rhit.comparisonChart.canvas.parentNode.style.padding = '10px';
							
							rhit.createdComparison = true;
						}


					timeByDate.sort((a, b) => new Date(a.meetdate) - new Date(b.meetdate));
					console.log(timeByDate);

					parsedDate.sort((a, b) => new Date(a) - new Date(b));

					const ctx2 = document.querySelector("#barChart");

						const dataChart = {
									labels: parsedDate,
									datasets: [{
									  label: `Swim Time (Seconds)`,
									  data: timeByDate,
									  backgroundColor: [
										
									  ],
									  borderColor: [
										
									  ],
									  borderWidth: 1,
									  parsing:{
										xAxisKey: 'meetdate',
										yAxisKey: 'racetime'
									}
									},]
								  };
								
								  var config = {
									  type:"bar",
									  data: dataChart,
									  options: {
										scales: {
										  y: {
											beginAtZero: true
										  }
										}
									  },
								  }
						
								if(rhit.created){
									// document.getElementById("barChart").remove();
									rhit.barChart.destroy();
									rhit.created = false;
								}
								if(rhit.created == false){
									rhit.barChart = new Chart(ctx2,config)
									
									rhit.created = true;
								}
								
								
						
								let perctange = document.querySelector("#perctange");
								let avg = 0;
								let ind = 0;
								for(let i = 0; i < timeByDate.length-1; i++){
									avg+= timeByDate[i].racetime
									ind+=1;
								}
						
								
								let p = ((timeByDate[timeByDate.length-1].racetime/avg))*100;
								avg = avg/ind;
								let diff = p/avg;
								diff = diff.toFixed(2);
								perctange.innerHTML = diff+ "%";
							}



	}



rhit.FbDatahubManager = class{
	constructor(id){
		this._id = id;
		this._documentSnapshots = null;
		this._sortedDocumentSnapShots = null;
		this.currentSize = 0;
	}

	loadRace(call_back){
		
		return fetch(apiURL+"race/"+this._id).then(response => response.json()).then((data) => {
			this._documentSnapshots = data.result;
			console.log("result"+data.result);
			call_back();
		}).catch((err) => {
			console.log(err);
		});
	}



	getdoc(racename){
		let toSort = [];
		//console.log("racename A"+racename);
		
		for(let i = 0 ; i < this._documentSnapshots[0].length ; i++){
			
			if(this._documentSnapshots[0][i].RaceName.toLowerCase() == racename.toLowerCase()){
				
				const c = {"meetName":this._documentSnapshots[0][i].MeetName, "meetDate":this._documentSnapshots[0][i].MeetDate
						,"racetime":this._documentSnapshots[0][i].RaceTime}

				toSort.push(c);

			}
			
		}
		return toSort;
	}

	getAmountRace(){

		
		return this.currentSize;
	}

	getAllRaceTime(){
		let time = new Array(this._documentSnapshots[0].length);

		console.log(this._documentSnapshots[0].length);
		for(let i = 0 ; i < this._documentSnapshots[0].length ; i++){
			
			
			time[i] = this._documentSnapshots[0][i].RaceTime;
		}
		return time;
	}


	getRaceTimeByName(racename){
		let time = [];
		//console.log("racename A"+racename);
		let counter = 0;
		for(let i = 0 ; i < this._documentSnapshots[0].length ; i++){
			
			if(this._documentSnapshots[0][i].RaceName.toLowerCase() == racename.toLowerCase()){
				counter+=1;
				time.push(this._documentSnapshots[0][i].RaceTime);

			}
			
		}

		this.currentSize = counter;

		return time;
	}

	getMeetName(racename){
		let names = [];

		
		for(let i = 0 ; i < this._documentSnapshots[0].length ; i++){
			if(this._documentSnapshots[0][i].RaceName.toLowerCase() == racename.toLowerCase()){
				names.push(this._documentSnapshots[0][i].MeetName);
			}
		}
		return names;
	}

	getAllDate(racename){
		let date = [];

		
		for(let i = 0 ; i < this._documentSnapshots[0].length ; i++){
			if(this._documentSnapshots[0][i].RaceName.toLowerCase() == racename.toLowerCase()){
				date.push(this._documentSnapshots[0][i].MeetDate);
			}
		}
		return date;
	}

	getUnit(){
		return this._documentSnapshots[0][0].Unit;
	}
}


rhit.initalize = function()
{

	if(document.querySelector("#loginpage")){
		
		new rhit.FbLoginPageController();

		let regBtn = document.querySelector("#registerBtn");
		regBtn.addEventListener("click",(event)=>{
			window.location.href = `register.html`;
		});
		
	}else if(document.querySelector("#mainPage")){
		//TO-DO use current user id to retrieve data
		console.log(rhit.fbLoginpageManager.getcurrentUserID());
		rhit.fbHomePageController = new rhit.FbHomePageController();
		const pBtn = document.querySelector("#profileBtn");
		pBtn.addEventListener("click",(event)=>{
		
			window.location.href = `profile.html`;
		});


		const dBtn = document.querySelector("#datahubBtn");
		dBtn.addEventListener("click",(event)=>{
			window.location.href = `datahub.html`;
		});
		

		const tBtn = document.querySelector("#trackerBtn")
		tBtn.addEventListener("click",(event)=>{
			window.location.href = `tracker.html`;
		});
	}else if(document.querySelector("#profilePage")){
		//for now put 1, login/register page allow us to put in generated id
		let id = sessionStorage.getItem('ID');
		rhit.fbSwimmerDetailManager =  new rhit.FbSwimmerDetailManager(id);
		rhit.fbSwimmerPageController = new rhit.FbSwimmerPageController();
		
		
	}else if(document.querySelector('#datahubPage')){
		let id = sessionStorage.getItem('ID');
		rhit.fbDatahubPageManager = new rhit.FbDatahubManager(id);
		rhit.fbcomparisonManager = new rhit.FbcomparisonManager();
		rhit.fbDatahubPageController = new rhit.FbDatahubPageController();
		
	}else if(document.querySelector("#registerPage")){
		rhit.fbregPageManager = new rhit.FbregPageManager();
		new rhit.FbregPageController
	}else if(document.querySelector("#trackerPage")){
		let addBtn = document.querySelector("#addBtn")
		
		addBtn.addEventListener("click",(event)=>{
			document.querySelector("#myForm").style.display = "block";
		});

		let closeBtn = document.querySelector("#closeBtn")
		closeBtn.addEventListener("click",(event)=>{
			document.querySelector("#myForm").style.display = "none";
		});
		
		new rhit.FbTrackerPageController();
		rhit.fbTrackerManager = new rhit.FbTrackerPageManager();
	}else if(document.querySelector("#improvementTargetPage")){
		rhit.fbImprovementPageManager = new rhit.FbImprovementPageManager();
		new rhit.FbImprovementPageController();
		
	}
}
/* Main */
/** function and class syntax examples */
rhit.main = function () {
	rhit.fbLoginpageManager = new rhit.FbLoginpageManager();
	rhit.initalize();
	
	
};

rhit.main();
