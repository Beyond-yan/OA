package com.gdssoft.oa.model.reports;
/**
 * 发文报表model
 * @author F3222507
 *
 */
public class SendReport {

	private String sendDep;
	private String name;
	private String subject;
	private String sender;
	private String sendTime;
	private String assigner;
	private String sendStatus;
	private String sendFinishTime;
	private String sendDealTime;
	private String receiveStatus;
	public String getSendDep() {
		return sendDep;
	}
	public void setSendDep(String sendDep) {
		this.sendDep = sendDep;
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
	public String getAssigner() {
		return assigner;
	}
	public void setAssigner(String assigner) {
		this.assigner = assigner;
	}
	public String getSendStatus() {
		return sendStatus;
	}
	public void setSendStatus(String sendStatus) {
		this.sendStatus = sendStatus;
	}
	public String getSendFinishTime() {
		return sendFinishTime;
	}
	public void setSendFinishTime(String sendFinishTime) {
		this.sendFinishTime = sendFinishTime;
	}
	public String getSendDealTime() {
		return sendDealTime;
	}
	public void setSendDealTime(String sendDealTime) {
		this.sendDealTime = sendDealTime;
	}
	public String getReceiveStatus() {
		return receiveStatus;
	}
	public void setReceiveStatus(String receiveStatus) {
		this.receiveStatus = receiveStatus;
	}
	
}
