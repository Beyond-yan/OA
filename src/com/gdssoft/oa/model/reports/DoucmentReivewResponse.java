package com.gdssoft.oa.model.reports;

import java.util.Date;

/**
 * 功能:用于返回文本评审数据源
 * @author lxwhappy
 *
 */
public class DoucmentReivewResponse {
	/**承办意见 */
	private String cbOpinion;
	/** 承办人签名*/
	private String cbName;
	/** 承办日期*/
	private Date cbDate;
	/** 部长意见*/
	private String bzOpinion;
	/** 部长签名*/
	private String bzName;
	/** 确认日期*/
	private Date qrDate;
	
	/** 回复人名称*/
	private String hfName;
	/** 拟稿人回复意见*/
	private String hfOpinion;
	/** 确认日期*/
	private Date hfDate;
	/** 评审部门*/
	private String psDepName;
	
	private String bzNamePic;
	
	public String getCbOpinion() {
		return cbOpinion;
	}
	public void setCbOpinion(String cbOpinion) {
		this.cbOpinion = cbOpinion;
	}
	public String getCbName() {
		return cbName;
	}
	public void setCbName(String cbName) {
		this.cbName = cbName;
	}
	public String getBzOpinion() {
		return bzOpinion;
	}
	public void setBzOpinion(String bzOpinion) {
		this.bzOpinion = bzOpinion;
	}
	public String getBzName() {
		return bzName;
	}
	public void setBzName(String bzName) {
		this.bzName = bzName;
	}
	public String getHfOpinion() {
		return hfOpinion;
	}
	public void setHfOpinion(String hfOpinion) {
		this.hfOpinion = hfOpinion;
	}
	public String getHfName() {
		return hfName;
	}
	public void setHfName(String hfName) {
		this.hfName = hfName;
	}
	public Date getCbDate() {
		return cbDate;
	}
	public void setCbDate(Date cbDate) {
		this.cbDate = cbDate;
	}
	public Date getQrDate() {
		return qrDate;
	}
	public void setQrDate(Date qrDate) {
		this.qrDate = qrDate;
	}
	public Date getHfDate() {
		return hfDate;
	}
	public void setHfDate(Date hfDate) {
		this.hfDate = hfDate;
	}
	public String getBzNamePic() {
		return bzNamePic;
	}
	public void setBzNamePic(String bzNamePic) {
		this.bzNamePic = bzNamePic;
	}
	public String getPsDepName() {
		return psDepName;
	}
	public void setPsDepName(String psDepName) {
		this.psDepName = psDepName;
	}
	
	
}
