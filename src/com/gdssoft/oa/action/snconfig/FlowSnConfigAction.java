package com.gdssoft.oa.action.snconfig;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.annotation.Resource;

import org.apache.commons.lang.StringUtils;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.util.BeanUtil;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.core.web.action.BaseAction;
import com.gdssoft.oa.model.snconfig.FileSnConfig;
import com.gdssoft.oa.model.snconfig.FlowSnConfig;
import com.gdssoft.oa.service.flow.ProDefinitionService;
import com.gdssoft.oa.service.flow.ProTypeService;
import com.gdssoft.oa.model.flow.ProDefinition;
import com.gdssoft.oa.model.flow.ProType;
import com.gdssoft.oa.model.law.LawsAuthor;
import com.gdssoft.oa.model.snconfig.FileSnConfig;
import com.gdssoft.oa.service.snconfig.FileSnConfigService;
import com.gdssoft.oa.service.snconfig.FlowSnConfigService;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;

import flexjson.DateTransformer;
import flexjson.JSONSerializer;
/**
 * 
 * @author 
 *
 */
public class FlowSnConfigAction extends BaseAction{
	@Resource
	private FlowSnConfigService flowSnConfigService;
	@Resource
	private ProDefinitionService proDefinitionService;
	@Resource
	private ProTypeService proTypeService;
	@Resource
	private FileSnConfigService fileSnConfigService;
	private FlowSnConfig flowSnConfig;
	
	private Long id;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public FlowSnConfig getflowSnConfig() {
		return flowSnConfig;
	}

	public void setflowSnConfig(FlowSnConfig flowSnConfig) {
		this.flowSnConfig = flowSnConfig;
	}

	/**
	 * 显示列表
	 */
	public String list(){
		QueryFilter filter=new QueryFilter(getRequest());
		List<FlowSnConfig> list= flowSnConfigService.getAll(filter);
		
		Type type=new TypeToken<List<FlowSnConfig>>(){}.getType();
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
		.append(filter.getPagingBean().getTotalItems()).append(",result:");
		
		Gson gson=new Gson();
		buff.append(gson.toJson(list, type));
		buff.append("}");
		
		jsonString=buff.toString();
		
		return SUCCESS;
	}
	/**
	 * 批量删除
	 * @return
	 */
	public String multiDel(){
		String flowId=getRequest().getParameter("flowId");
		String[]ids=getRequest().getParameterValues("ids");
		if(ids!=null&& flowId!=null){
			for(String id:ids){
				QueryFilter filter=new QueryFilter(getRequest());
				filter.addFilter("Q_flowId_L_EQ", flowId);
				filter.addFilter("Q_fileSnConfig.id_L_EQ", id);
				List<FlowSnConfig> list=flowSnConfigService.getAll(filter);
				if(list.size()>0){
					for(FlowSnConfig flowSnConfig:list){
						flowSnConfigService.remove(flowSnConfig.getId());
					}
				}
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
		FlowSnConfig flowSnConfig=flowSnConfigService.get(id);
		
		Gson gson=new GsonBuilder().setDateFormat("yyyy-MM-dd").create();
		//将数据转成JSON格式
		StringBuffer sb = new StringBuffer("{success:true,data:");
		sb.append(gson.toJson(flowSnConfig));
		sb.append("}");
		setJsonString(sb.toString());
		
		return SUCCESS;
	}
	/**
	 * 添加及保存操作
	 */
	public String save(){
		String[]ids=getRequest().getParameterValues("ids");
		String flowId=getRequest().getParameter("flowId");
		if(ids!=null){
			for(String id:ids){
				FlowSnConfig flowSn=new FlowSnConfig();
				FileSnConfig fileSnConfig=new FileSnConfig();
				fileSnConfig.setId(new Long(id));
				flowSn.setFileSnConfig(fileSnConfig);
				flowSn.setFlowId(new Long(flowId));
				flowSn.setCreateDate(new Date());
				flowSn.setCreateUser(ContextUtil.getCurrentUser().getUsername());
				flowSnConfigService.save(flowSn);
			}
		}
		setJsonString("{success:true}");
		return SUCCESS;
		
	}
	//流程列表
	public String root(){
		List<ProType> processTypeList = proTypeService.getAll();
		StringBuffer sb = new StringBuffer(
				"[{id:'0',text:'流程名称',leaf:false,expanded:true,children:[");
		for (ProType proType : processTypeList) {
			sb.append("{id:'").append(proType.getTypeId()).append("',text:'")
					.append(proType.getTypeName()).append("',leaf:false,expanded:true,children:[");
			QueryFilter filter=new QueryFilter(getRequest());
			filter.getPagingBean().setPageSize(1000000000);
			filter.addFilter("Q_proType.typeId_L_EQ", String.valueOf(proType.getTypeId()));
			List<ProDefinition> list = proDefinitionService.getAll(filter);
			for (ProDefinition proDefinition : list) {
				sb.append("{id:'").append(proDefinition.getDefId()).append("',text:'")
						.append(proDefinition.getName()).append("',leaf:true},");
			}
			if (!list.isEmpty()) {
				sb.deleteCharAt(sb.length() - 1);
			}
			sb.append("]},");
		}
		if (!processTypeList.isEmpty()) {
			sb.deleteCharAt(sb.length() - 1);
		}
		sb.append("]}]");
		this.jsonString = sb.toString();
		return SUCCESS;
	}
	//获取已选编号
	public String getCheckSigns(){
		String flowId=getRequest().getParameter("flowId");
		QueryFilter filter=new QueryFilter(getRequest());
		List<FileSnConfig> checkSigns=new ArrayList<FileSnConfig>();
		StringBuffer buff = new StringBuffer("{success:true");
		if(flowId!=null&&!"".equals(flowId)){
			filter.addFilter("Q_flowSnConfigs.flowId_L_EQ",flowId);
			checkSigns=fileSnConfigService.getAll(filter);
			buff.append(",'totalCounts':").append(filter.getPagingBean().getTotalItems())
					.append(",data:");
			JSONSerializer json = new JSONSerializer();
			json.transform(new DateTransformer("yyyy-MM-dd"), new String[] {
					"createDate", "updateDate",  "expirationDate" });
			buff.append(json.exclude(new String[] { "class" }).serialize(checkSigns));
		}else{
			buff.append(",data:[]");
		}
		buff.append("}");
		jsonString=buff.toString();
		return SUCCESS;
	}
	//获取已设置的流程编号，绑定下拉列表
	public String getSigns(){
		String flowId=getRequest().getParameter("flowId");
		StringBuffer sb = new StringBuffer("[");
		if(flowId!=null&&flowId.indexOf("$")==-1){
			QueryFilter filter=new QueryFilter(getRequest());
			filter.addFilter("Q_flowId_L_EQ",flowId);
			filter.addSorted("fileSnConfig.snNumber", "desc");
			filter.getPagingBean().setPageSize(Integer.MAX_VALUE);
			List<FlowSnConfig> list= flowSnConfigService.getAll(filter);
			for(FlowSnConfig flowSnConfig:list){
				sb.append("[\"" + flowSnConfig.getSnId() + "\",\""
						+ flowSnConfig.getFileSnConfig().getSnName()+ "\"],");
			}
			if(!list.isEmpty()){
			sb.deleteCharAt(sb.length() - 1);
			}
		}
		sb.append("]");
		setJsonString(sb.toString());
		return SUCCESS;
	}
	//获取已设置的流程的编号ID
	public String getSigId(){
		String flowId=getRequest().getParameter("flowId");
		Long sigId =  null;
		String sigName = null;
		StringBuffer sb = new StringBuffer();
		if(flowId!=null&&flowId.indexOf("$")==-1){
			QueryFilter filter=new QueryFilter(getRequest());
			filter.addFilter("Q_flowId_L_EQ",flowId);
			List<FlowSnConfig> list= flowSnConfigService.getAll(filter);
			if(0 != list.size()){
				sb.append("{success:true,data:'");
				sigId = list.get(0).getSnId();
				sb.append(sigId + "',dataName:'");
				sigName = list.get(0).getFileSnConfig().getSnName();
				sb.append(sigName + "'");
			}else{
				sb.append("{success:false,data:'snConfigId is null!'");
			}
		}
		sb.append("}");
		setJsonString(sb.toString());
		return SUCCESS;
	}
	//获得收文编号名称
	public String getReceiveSigns(){
		String archType=getRequest().getParameter("archType");
		StringBuffer sb = new StringBuffer("[");
		if(archType!=null&&!archType.isEmpty()){
			QueryFilter filter=new QueryFilter(getRequest());
			filter.addFilter("Q_snType_L_EQ", archType);
			List<FileSnConfig> list=fileSnConfigService.getAll(filter);
			for(FileSnConfig fileSnConfig:list){
				sb.append("[\"" + fileSnConfig.getId() + "\",\""
						+ fileSnConfig.getSnName()+ "\"],");
			}
			if(!list.isEmpty()){
				sb.deleteCharAt(sb.length() - 1);
			}
		}
		sb.append("]");
		setJsonString(sb.toString());
		return SUCCESS;
	}
	
	//获取已选编号
		public String getCheckSignsCombo(){
			String flowId=getRequest().getParameter("flowId");
			QueryFilter filter=new QueryFilter(getRequest());
			List<FileSnConfig> checkSigns=new ArrayList<FileSnConfig>();
			StringBuffer buff = new StringBuffer("[");
			if(flowId!=null&&!"".equals(flowId)){
				filter.addFilter("Q_flowSnConfigs.flowId_L_EQ",flowId);
				checkSigns=fileSnConfigService.getAll(filter);
				for (FileSnConfig fsc : checkSigns) {
					buff.append("['").append(fsc.getId()).append("','")
							.append(fsc.getSnName()).append("']");
					buff.append(",");
				}
				buff.deleteCharAt(buff.length() - 1);
			}
			
			buff.append("]");
			jsonString=buff.toString();
			return SUCCESS;
		}
}
