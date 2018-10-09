package com.gdssoft.oa.model.reports;
/**
 * 部门级统计报表model
 * @author F3222507
 *
 */
public class DepartmentReport {
	private String depName;
	private String fileName;
	private String fileType;
	private String finish;
	private String notFinish1;
	private String notFinsih2;
	private String total;
	
	private String recFinish;
	private String recNotFinish1;
	private String recNotFinish2;
	private String recTotal;
	public String getDepName() {
		return depName;
	}
	public void setDepName(String depName) {
		this.depName = depName;
	}
	
	public String getFileName() {
		return fileName;
	}
	public void setFileName(String fileName) {
		this.fileName = fileName;
	}
	public String getFileType() {
		return fileType;
	}
	public void setFileType(String fileType) {
		this.fileType = fileType;
	}
	public String getFinish() {
		return finish;
	}
	public void setFinish(String finish) {
		this.finish = finish;
	}
	public String getNotFinish1() {
		return notFinish1;
	}
	public void setNotFinish1(String notFinish1) {
		this.notFinish1 = notFinish1;
	}
	public String getNotFinsih2() {
		return notFinsih2;
	}
	public void setNotFinsih2(String notFinsih2) {
		this.notFinsih2 = notFinsih2;
	}
	public String getTotal() {
		return total;
	}
	public void setTotal(String total) {
		this.total = total;
	}
	public String getRecFinish() {
		return recFinish;
	}
	public void setRecFinish(String recFinish) {
		this.recFinish = recFinish;
	}
	public String getRecNotFinish1() {
		return recNotFinish1;
	}
	public void setRecNotFinish1(String recNotFinish1) {
		this.recNotFinish1 = recNotFinish1;
	}
	public String getRecNotFinish2() {
		return recNotFinish2;
	}
	public void setRecNotFinish2(String recNotFinish2) {
		this.recNotFinish2 = recNotFinish2;
	}
	public String getRecTotal() {
		return recTotal;
	}
	public void setRecTotal(String recTotal) {
		this.recTotal = recTotal;
	}
	
}
