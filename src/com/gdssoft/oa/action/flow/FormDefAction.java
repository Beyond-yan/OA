package com.gdssoft.oa.action.flow;
/*
 * 捷达世软件(深圳)有限公司 OA办公管理系统 
*/

import java.io.File;
import java.lang.reflect.Type;
import java.util.List;
import javax.annotation.Resource;

import com.gdssoft.oa.model.flow.ExtFormItem;
import com.gdssoft.oa.model.flow.FormDef;
import com.gdssoft.oa.model.flow.ProDefinition;
import com.gdssoft.oa.service.flow.FormDefService;
import com.gdssoft.oa.service.flow.JbpmService;
import com.gdssoft.oa.service.flow.ProDefinitionService;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;
import com.gdssoft.core.Constants;
import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.jbpm.jpdl.Node;
import com.gdssoft.core.util.AppUtil;
import com.gdssoft.core.util.FileUtil;
import com.gdssoft.core.web.action.BaseAction;



/**
 * 
 * @author 
 *
 */
public class FormDefAction extends BaseAction{
	@Resource
	private ProDefinitionService proDefinitionService;
	@Resource
	private JbpmService jbpmService;
	
	@Resource
	private FormDefService formDefService;
	private FormDef formDef;
	
	private Long formDefId;
	/**
	 * 流程定义ID
	 */
	private String defId;
	
	
	public String getDefId() {
		return defId;
	}

	public void setDefId(String defId) {
		this.defId = defId;
	}

	public Long getFormDefId() {
		return formDefId;
	}

	public void setFormDefId(Long formDefId) {
		this.formDefId = formDefId;
	}

	public FormDef getFormDef() {
		return formDef;
	}

	public void setFormDef(FormDef formDef) {
		this.formDef = formDef;
	}
	
	public String nodes(){
		
		List<Node> nodes = jbpmService.getTaskNodesByDefId(new Long(defId));
		
		StringBuffer sb=new StringBuffer("{data:['");
		
		for(Node node:nodes){
			sb.append("'").append(node.getName()).append("',");
		}
		sb.append("]}");
		setJsonString(sb.toString());
		return SUCCESS;
	}
	
	/**
	 * 为某个流程所有任务添加缺省的表单定义
	 * @return
	 */
	public String addAll(){
		
		List<Node> nodes = jbpmService.getFormNodes(new Long(defId));
		ProDefinition proDefinition= proDefinitionService.get(new Long(defId));
		
		for(Node node:nodes){
			FormDef formDef=formDefService.getByDeployIdActivityName(proDefinition.getDeployId(), node.getName());
			if(formDef==null){
				formDef=new FormDef();
				formDef.setActivityName(node.getName());
				formDef.setColumns(FormDef.DEFAULT_COLUMNS);
				formDef.setFormName(node.getName()+"-表单");
				formDef.setIsEnabled(Constants.ENABLED);
				formDef.setDeployId(proDefinition.getDeployId());
				formDefService.save(formDef);
			}
		}
		setJsonString("{success:true}");
		return SUCCESS;
	}

	/**
	 * 用于某个流程表单选择器及管理功能
	 * @return
	 */
	public String select(){
		QueryFilter filter=new QueryFilter(getRequest());
		List<FormDef> list= formDefService.getAll(filter);
		
		Type type=new TypeToken<List<FormDef>>(){}.getType();
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
		.append(filter.getPagingBean().getTotalItems()).append(",result:");
		
		Gson gson=new GsonBuilder().excludeFieldsWithoutExposeAnnotation().create();
		buff.append(gson.toJson(list, type));
		buff.append("}");
		
		jsonString=buff.toString();
		return SUCCESS;
	}
	
	/**
	 * 某一流程定义的表单列表
	 */
	public String list(){
		
		ProDefinition proDefinition= proDefinitionService.get(new Long(defId));

		List<Node> nodes = jbpmService.getFormNodes(new Long(defId));
		
		List<FormDef> formDefs=formDefService.getByDeployId(proDefinition.getDeployId());
		
		StringBuffer buff = new StringBuffer("{result:[");
		
		for(int i=0;i<nodes.size();i++){
			String nodeName=nodes.get(i).getName();
			buff.append("{activityName:'").append(nodeName).append("',deployId:'" + proDefinition.getDeployId()).append("'");
			
			for(FormDef def:formDefs){
				if(nodeName.equals(def.getActivityName())){
					buff.append(",formDefId:'").append(def.getFormDefId()).append("',formName:'").append(def.getFormName()).append("'");
					break;
				}
			}
			buff.append("},");
		}
		
		if(nodes.size()>0){
			buff.deleteCharAt(buff.length()-1);
		}
		
		buff.append("]}");
		
		
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
				formDefService.remove(new Long(id));
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
		FormDef formDef=formDefService.get(formDefId);
		
		Gson gson=new Gson();
		//将数据转成JSON格式
		StringBuffer sb = new StringBuffer("{success:true,data:");
		sb.append(gson.toJson(formDef));
		sb.append("}");
		setJsonString(sb.toString());
		
		return SUCCESS;
	}
	/**
	 * 流程表单的自定义保存
	 */
	public String save(){
		
		String activityName=getRequest().getParameter("activityName");
		FormDef formDef=formDefService.get(formDefId);
		//保存该表单的Ext项目配置,为下次加载修改恢复提供数据来源
		String extDef=getRequest().getParameter("extDef");
		formDef.setExtDef(extDef);
		formDefService.save(formDef);
		
		//取得流程对应的定义，把该任务的表单写至表单模板的js中，同时生成对应的映射文件.
	
		String extFormDef=getRequest().getParameter("extFormDef");
		String formItemDef=getRequest().getParameter("formItemDef");
		
		logger.info("extFormDef:" + extFormDef);
		logger.info("formItemDef:" + formItemDef);
		
		ProDefinition proDefinition=proDefinitionService.getByDeployId(formDef.getDeployId());
		String formPath=AppUtil.getAppAbsolutePath() + "/WEB-INF/FlowForm/" + proDefinition.getName();
		
		File flowDirPath=new File(formPath);
		if(!flowDirPath.exists()){//若不存在目录，则创建
			flowDirPath.mkdirs();
		}
		Gson gson=new Gson();
		
		ExtFormItem[]formItems=gson.fromJson("["+formItemDef+"]", ExtFormItem[].class);
		StringBuffer xmlBuf=new StringBuffer(); 
		
		if(formItems!=null){
			xmlBuf.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n");
			xmlBuf.append("<fields>\n");
			for(ExtFormItem item:formItems){
				xmlBuf.append("\t<field name=\"" + item.getName()+ "\" label=\""+ item.getFieldLabel() 
						+ "\" type=\"" + item.getType() + "\" length=\"" + item.getMaxLength() +"\" isShowed=\"" + item.getIsShowed() + "\"/>\n");
			}
			xmlBuf.append("</fields>\n");
		}
		
		if(xmlBuf.length()>0){
			String fieldFilePath=formPath + "/" + activityName + "-fields.xml";
			FileUtil.writeFile(fieldFilePath,xmlBuf.toString());
		}
		
		if(proDefinition!=null){
			//把表单的定义写至文件
			String extFilePath=formPath + "/" + activityName + ".vm";
			FileUtil.writeFile(extFilePath,extFormDef);
		}
		return SUCCESS;
	}
	
	/**
	 * 保存表单VM与XML映射文件
	 * @return
	 */
	public String saveVmXml(){
		
		String deployId=getRequest().getParameter("deployId");
		String activityName=getRequest().getParameter("activityName");
		
		String vmSources=getRequest().getParameter("vmSources");
		
		String xmlSources=getRequest().getParameter("xmlSources");
		
		ProDefinition proDefinition=proDefinitionService.getByDeployId(deployId);
		String filePath=AppUtil.getAppAbsolutePath() + "/WEB-INF/FlowForm/" + proDefinition.getName() + "/" + activityName;
		
		String vmFilePath=filePath+".vm";
		String xmlFilePath=filePath+"-fields.xml";
		
		FileUtil.writeFile(vmFilePath,vmSources);
		
		FileUtil.writeFile(xmlFilePath,xmlSources);
		
		setJsonString("{success:true}");
		
		return SUCCESS;
	}
	/**
	 * 取得表单VM与XML的源代码
	 * @return
	 */
	public String getVmXml(){
		
		String deployId=getRequest().getParameter("deployId");
		String activityName=getRequest().getParameter("activityName");
		
		ProDefinition proDefinition=proDefinitionService.getByDeployId(deployId);
		String filePath=AppUtil.getAppAbsolutePath() + "/WEB-INF/FlowForm/" + proDefinition.getName() + "/" + activityName;
		
		String vmFilePath=filePath+".vm";
		String xmlFilePath=filePath+"-fields.xml";
		
		String vmSources=FileUtil.readFile(vmFilePath);
		String xmlSources=FileUtil.readFile(xmlFilePath);
		Gson gson=new Gson();
		
		setJsonString("{success:true,vmSources:" + gson.toJson(vmSources) + ",xmlSources:"+ gson.toJson(xmlSources)+"}");
		
		return SUCCESS;
	}
	
	
	
	
	
}
