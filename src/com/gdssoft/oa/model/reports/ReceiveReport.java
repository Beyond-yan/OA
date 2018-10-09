package com.gdssoft.oa.model.reports;
/**
 * 收文报表model
 * @author F3222507
 *
 */
public class ReceiveReport {

	private String recDep;
	private String name;
	private String subject;
	private String sendDep;
	private String sender;
	private String sendTime;
	private String recTime;
	private String assigner;
	private String status;
	private String finishTime;
	private String dealTime;
	private String stepDealer;
	private String stepFinishTime;
	private String preStepFinishTime;
	private String setpTime;
	
	
	public String getSetpTime() {
		return setpTime;
	}
	public void setSetpTime(String setpTime) {
		this.setpTime = setpTime;
	}
	public String getPreStepFinishTime() {
		return preStepFinishTime;
	}
	public void setPreStepFinishTime(String preStepFinishTime) {
		this.preStepFinishTime = preStepFinishTime;
	}
	public String getStepFinishTime() {
		return stepFinishTime;
	}
	public void setStepFinishTime(String stepFinishTime) {
		this.stepFinishTime = stepFinishTime;
	}
	public String getStepDealer() {
		return stepDealer;
	}
	public void setStepDealer(String stepDealer) {
		this.stepDealer = stepDealer;
	}
	public String getRecDep() {
		return recDep;
	}
	public void setRecDep(String recDep) {
		this.recDep = recDep;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getSubject() {
		return subject;
	}
	public void setSubject(String subject) {
		this.subject = subject;
	}
	public String getSendDep() {
		return sendDep;
	}
	public void setSendDep(String sendDep) {
		this.sendDep = sendDep;
	}
	public String getSender() {
		return sender;
	}
	public void setSender(String sender) {
		this.sender = sender;
	}
	public String getSendTime() {
		return sendTime;
	}
	public void setSendTime(String sendTime) {
		this.sendTime = sendTime;
	}
	public String getRecTime() {
		return recTime;
	}
	public void setRecTime(String recTime) {
		this.recTime = recTime;
	}
	public String getAssigner() {
		return assigner;
	}
	public void setAssigner(String assigner) {
		this.assigner = assigner;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getFinishTime() {
		return finishTime;
	}
	public void setFinishTime(String finishTime) {
		this.finishTime = finishTime;
	}
	public String getDealTime() {
		return dealTime;
	}
	public void setDealTime(String dealTime) {
		this.dealTime = dealTime;
	}
	
}
