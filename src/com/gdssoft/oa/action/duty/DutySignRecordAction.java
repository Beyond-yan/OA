package com.gdssoft.oa.action.duty;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import javax.annotation.Resource;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.gdssoft.core.util.BeanUtil;
import com.gdssoft.core.util.ContextUtil;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.web.action.BaseAction;


import com.gdssoft.oa.model.duty.DutySignRecord;
import com.gdssoft.oa.service.duty.DutySignRecordService;

import flexjson.DateTransformer;
import flexjson.JSONSerializer;
/**
 * 
 * @author 
 *
 */
public class DutySignRecordAction extends BaseAction{
	@Resource
	private DutySignRecordService dutySignRecordService;
	private DutySignRecord dutySignRecord;
	private List<DutySignRecord> dutySignRecordList;
	
	private Long id;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public DutySignRecord getDutySignRecord() {
		return dutySignRecord;
	}

	public void setDutySignRecord(DutySignRecord dutySignRecord) {
		this.dutySignRecord = dutySignRecord;
	}

	
	public List<DutySignRecord> getDutySignRecordList() {
		return dutySignRecordList;
	}

	public void setDutySignRecordList(List<DutySignRecord> dutySignRecordList) {
		this.dutySignRecordList = dutySignRecordList;
	}

	/**
	 * 显示列表
	 */
	public String list(){
		QueryFilter filter=new QueryFilter(getRequest());
		SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
		Calendar cl =  Calendar.getInstance();
		cl.setTime(new Date());
		cl.set(Calendar.DAY_OF_WEEK,Calendar.MONDAY);
		String startDate=formatter.format(cl.getTime());
		cl.add(cl.DATE, 7);
		String endDate=formatter.format(cl.getTime());
		filter.addFilter("Q_signDate_D_GE", startDate);
		filter.addFilter("Q_signDate_D_LE", endDate);
		List<DutySignRecord> list= dutySignRecordService.getAll(filter);
		for(DutySignRecord dutySignRecord:list){
			Calendar bl =  Calendar.getInstance();
			bl.setTime(dutySignRecord.getSignDate());
			int i=bl.get(Calendar.DAY_OF_WEEK);
			String str="";
			switch(i){
			case 2:
				str="星期一";break;
			case 3:
				str="星期二";break;
			case 4:
				str="星期三";break;
			case 5:
				str="星期四";break;
			case 6:
				str="星期五";break;
			case 7:
				str="星期六";break;
			default:
				str="星期日";
			}
			SimpleDateFormat fortime = new SimpleDateFormat("HH:mm");
			dutySignRecord.setSgDate(formatter.format(dutySignRecord.getSignDate())+"("+str+")");
			dutySignRecord.setSgTime(fortime.format(dutySignRecord.getSignDate()));
		}
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
		.append(filter.getPagingBean().getTotalItems()).append(",result:");
		JSONSerializer json = new JSONSerializer();
		json.transform(new DateTransformer("yyyy-MM-dd"), new String[] {
				"signDate","createDate"});
		buff.append(json.exclude(new String[] { "class" }).serialize(list));
		buff.append("}");
		jsonString=buff.toString();
		return SUCCESS;
	}
	/**
	 * 批量删除
	 * @return
	 */
	public String multiDel(){
		
		String[]ids=getRequest().getParameterValues("ids");
		if(ids!=null){
			for(String id:ids){
				dutySignRecordService.remove(new Long(id));
			}
		}
		
		jsonString="{success:true}";
		
		return SUCCESS;
	}
	
	/**
	 * 显示详细信息
	 * @return
	 */
	public String get(){
		DutySignRecord cqDutySignRecord=dutySignRecordService.get(id);
		
		Gson gson=new GsonBuilder().setDateFormat("yyyy-MM-dd").create();
		//将数据转成JSON格式
		StringBuffer sb = new StringBuffer("{success:true,data:");
		sb.append(gson.toJson(cqDutySignRecord));
		sb.append("}");
		setJsonString(sb.toString());
		
		return SUCCESS;
	}
	/**
	 * 添加及保存操作
	 */
	public String save(){
		String signDate = getRequest().getParameter("dutySignRecord.signDate");
		signDate +=":00";
		SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		try {
			dutySignRecord.setSignDate(formatter.parse(signDate));
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		if(dutySignRecord.getId()==null){
			dutySignRecord.setCreateUser(ContextUtil.getCurrentUserId());
			dutySignRecord.setCreateDate(new Date());
			dutySignRecordService.save(dutySignRecord);
		}else{
			DutySignRecord orgDutySignRecord=dutySignRecordService.get(dutySignRecord.getId());
			try{
				BeanUtil.copyNotNullProperties(orgDutySignRecord, dutySignRecord);
				dutySignRecordService.save(orgDutySignRecord);
			}catch(Exception ex){
				logger.error(ex.getMessage());
			}
		}
		setJsonString("{success:true}");
		return SUCCESS;
		
	}
	public String getdutySchedulerItem(){
		List<DutySignRecord> list=dutySignRecordService.getAll();
		for(DutySignRecord dutySignRecord:list){
			SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm");
			String sgDate=formatter.format(dutySignRecord.getSignDate());
			dutySignRecord.setSgDate(sgDate);
			Calendar cal = Calendar.getInstance();
			cal.setTime(dutySignRecord.getSignDate());   
			cal.add(Calendar.MINUTE,4);
			dutySignRecord.setSgTime(formatter.format(cal.getTime()));
		}
		dutySignRecordList=list;
		return SUCCESS;
	}
}
