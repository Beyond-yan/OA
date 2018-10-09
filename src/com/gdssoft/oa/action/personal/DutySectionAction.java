package com.gdssoft.oa.action.personal;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.util.List;
import javax.annotation.Resource;

import com.gdssoft.oa.model.personal.DutySection;
import com.gdssoft.oa.service.personal.DutySectionService;
import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.util.JsonUtil;
import com.gdssoft.core.web.action.BaseAction;


import flexjson.JSONSerializer;
/**
 * 
 * @author 
 *
 */
public class DutySectionAction extends BaseAction{
	@Resource
	private DutySectionService dutySectionService;
	private DutySection dutySection;
	
	private Long sectionId;

	public Long getSectionId() {
		return sectionId;
	}

	public void setSectionId(Long sectionId) {
		this.sectionId = sectionId;
	}

	public DutySection getDutySection() {
		return dutySection;
	}

	public void setDutySection(DutySection dutySection) {
		this.dutySection = dutySection;
	}

	/**
	 * 显示列表
	 */
	public String list(){
		
		QueryFilter filter=new QueryFilter(getRequest());
		List<DutySection> list= dutySectionService.getAll(filter);
		
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
		.append(filter.getPagingBean().getTotalItems()).append(",result:");
		
		JSONSerializer serializer=JsonUtil.getJSONSerializer();
		buff.append(serializer.serialize(list));
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
				dutySectionService.remove(new Long(id));
			}
		}
		jsonString="{success:true}";
		return SUCCESS;
	}
	
	public String combo(){
		StringBuffer sb=new StringBuffer();
		
		List<DutySection> dutySectionList=dutySectionService.getAll();
		sb.append("[");
		for(DutySection dutySection:dutySectionList){
			sb.append("['").append(dutySection.getSectionId()).append("','").append(dutySection.getSectionName()).append("'],");
		}
		if(dutySectionList.size()>0){
			sb.deleteCharAt(sb.length()-1);
		}
		sb.append("]");
		setJsonString(sb.toString());
		return SUCCESS;
		
	}
	
	/**
	 * 显示详细信息
	 * @return
	 */
	public String get(){
		DutySection dutySection=dutySectionService.get(sectionId);
		
		JSONSerializer serializer=JsonUtil.getJSONSerializer();
		//将数据转成JSON格式
		StringBuffer sb = new StringBuffer("{success:true,data:");
		sb.append(serializer.serialize(dutySection));
		sb.append("}");
		setJsonString(sb.toString());
		
		return SUCCESS;
	}
	/**
	 * 添加及保存操作
	 */
	public String save(){
		//set the time here
		dutySectionService.save(dutySection);
		setJsonString("{success:true}");
		return SUCCESS;
	}
}
