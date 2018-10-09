package com.gdssoft.oa.action.flow;

/*
 * 捷达世软件(深圳)有限公司 OA办公管理系统 
 */
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import javax.annotation.Resource;

import org.apache.commons.lang.StringUtils;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.jbpm.jpdl.JpdlConverter;
import com.gdssoft.core.util.BeanUtil;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.core.util.JsonUtil;
import com.gdssoft.core.web.action.BaseAction;
import com.gdssoft.core.web.paging.PagingBean;
import com.gdssoft.oa.model.flow.ProDefinition;
import com.gdssoft.oa.model.flow.ProType;
import com.gdssoft.oa.model.system.AppRole;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.service.flow.JbpmService;
import com.gdssoft.oa.service.flow.ProDefinitionService;
import com.gdssoft.oa.service.flow.ProTypeService;

import flexjson.JSONSerializer;

/**
 * 
 * @author csx
 * 
 */
public class ProDefinitionAction extends BaseAction {
	@Resource
	private ProDefinitionService proDefinitionService;
	@Resource
	private ProTypeService proTypeService;
	@Resource
	private JbpmService jbpmService;

	private ProDefinition proDefinition;

	private Long defId;

	public Long getDefId() {
		return defId;
	}

	public void setDefId(Long defId) {
		this.defId = defId;
	}

	public ProDefinition getProDefinition() {
		return proDefinition;
	}

	public void setProDefinition(ProDefinition proDefinition) {
		this.proDefinition = proDefinition;
	}

	/**
	 * 显示列表
	 */
	public String list() {
		boolean isadmin = false;
		AppUser appUser = ContextUtil.getCurrentUser();
		for (AppRole appRole : appUser.getRoles()) {
			if (appRole.getId().equals("-1")) {
				isadmin = true;
				break;
			}
		}
		String typeId = getRequest().getParameter("typeId");
		List<ProDefinition> list = new ArrayList<ProDefinition>();
		int count = 0;
//		if (!isadmin && (StringUtils.isEmpty(typeId) || "0".equals(typeId))) {
//			PagingBean pb = new PagingBean(start, limit);
//			list = proDefinitionService.getProDefinitions("系统使用", "测试备份", pb);
//			count = proDefinitionService
//					.getProDefinitions("系统使用", "测试备份", null).size();
//		} else {
			QueryFilter filter = new QueryFilter(getRequest());
			if (StringUtils.isNotEmpty(typeId) && !"0".equals(typeId)) {
				filter.addFilter("Q_proType.typeId_L_EQ", typeId);
			}
			filter.addSorted("sequence", "asc");
			list = proDefinitionService.getAll(filter);
			count = filter.getPagingBean().getTotalItems();

//		}
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
				.append(count).append(",result:");

		JSONSerializer serializer = JsonUtil.getJSONSerializer("createtime")
				.exclude("defXml");

		buff.append(serializer.serialize(list));
		buff.append("}");

		jsonString = buff.toString();

		return SUCCESS;
	}

	/**
	 * 批量删除
	 * 
	 * @return
	 */
	public String multiDel() {

		String[] ids = getRequest().getParameterValues("ids");
		if (ids != null) {
			for (String id : ids) {
				// 删除流程的定义，就会删除流程的实例，表单的数据及Jbpm的流程相关的内容
				// proDefinitionService.remove(new Long(id));
				jbpmService.doUnDeployProDefinition(new Long(id));
			}
		}

		jsonString = "{success:true}";

		return SUCCESS;
	}

	/**
	 * 显示详细信息
	 * 
	 * @return
	 */
	public String get() {

		if (defId != null) {
			proDefinition = proDefinitionService.get(defId);
		} else {
			proDefinition = new ProDefinition();
			String proTypeId = getRequest().getParameter("proTypeId");
			if (StringUtils.isNotEmpty(proTypeId)) {
				ProType proType = proTypeService.get(new Long(proTypeId));
				proDefinition.setProType(proType);
			}
		}

		// 用JSONSerializer解决延迟加载的问题
		JSONSerializer serializer = JsonUtil.getJSONSerializer("createtime");
		// 将数据转成JSON格式
		StringBuffer sb = new StringBuffer("{success:true,data:");
		sb.append(serializer.serialize(proDefinition));
		sb.append("}");
		setJsonString(sb.toString());

		return SUCCESS;
	}

	public String defSave() {
		logger.info("...eneter defSave......");

		if (StringUtils.isNotEmpty(proDefinition.getDrawDefXml())) {
			// 产生唯一的process name
			Long uuid = Math.abs(UUID.randomUUID().getLeastSignificantBits());

			String defXml = JpdlConverter.JpdlGen(
					proDefinition.getDrawDefXml(), "pd" + uuid);

			defXml = defXml.replace("<process",
					"<process xmlns=\"http://jbpm.org/4.0/jpdl\"");

			if (logger.isDebugEnabled()) {
				logger.debug("jbpmXml:" + defXml);
			}

			proDefinition.setDefXml(defXml);

			save();
		}

		return SUCCESS;
	}

	/**
	 * 添加及保存操作
	 */
	public String save() {
		System.out.println("-----sequence-----" + proDefinition.getSequence());
		Long proTypeId = proDefinition.getProTypeId();
		if (proTypeId != null) {
			ProType proType = proTypeService.get(proTypeId);
			proDefinition.setProType(proType);
		}
		if (proDefinition.getDefId() != null) {// 更新操作
			ProDefinition proDef = proDefinitionService.get(proDefinition
					.getDefId());
			try {
				BeanUtil.copyNotNullProperties(proDef, proDefinition);
				// jbpmService.saveOrUpdateDeploy(proDef);
				proDefinitionService.save(proDef);
			} catch (Exception ex) {
				ex.printStackTrace();
				logger.error(ex.getMessage());
			}
		} else {// 添加流程
			proDefinition.setCreatetime(new Date());

			if (logger.isDebugEnabled()) {
				logger.info("---start deploy---");
			}

			jbpmService.saveOrUpdateDeploy(proDefinition);
		}
		setJsonString("{success:true}");
		return SUCCESS;
	}

	/**
	 * 
	 * combox调用
	 * 
	 * @return
	 */
	public String com() {
//		boolean isadmin = false;
//		AppUser appUser = ContextUtil.getCurrentUser();
//		for (AppRole appRole : appUser.getRoles()) {
//			if (appRole.getId().equals("-1")) {
//				isadmin = true;
//				break;
//			}
//		}
		QueryFilter filter = new QueryFilter(getRequest());
		filter.getPagingBean().setPageSize(99999);
		List<ProDefinition> list = proDefinitionService.getAll(filter);
		StringBuffer sb = new StringBuffer();
		sb.append("[");
		sb.append("['','全部'],");
		int i = 1;
		for (ProDefinition proDefinition : list) {			
			if (proDefinition.getProType().getTypeName().equals("系统使用")
					|| proDefinition.getProType().getTypeName().equals(
							"测试备份")) {
				continue;
			}
			i++;
			sb.append("['").append(proDefinition.getDefId()).append("','")
					.append(proDefinition.getName()).append("']");
			sb.append(",");			
		}
		sb.deleteCharAt(sb.length()-1);//删除最后一个","字符
		sb.append("]");
		setJsonString(sb.toString());
		return SUCCESS;
	}
	
	/**
	 * 
	 * combox调用包含收文def记录
	 * 
	 * @return
	 */
	public String comIncludeRecv() {
//		boolean isadmin = false;
//		AppUser appUser = ContextUtil.getCurrentUser();
//		for (AppRole appRole : appUser.getRoles()) {
//			if (appRole.getId().equals("-1")) {
//				isadmin = true;
//				break;
//			}
//		}
		QueryFilter filter = new QueryFilter(getRequest());
		filter.getPagingBean().setPageSize(99999);
		List<ProDefinition> list = proDefinitionService.getAll(filter);
		StringBuffer sb = new StringBuffer();
		sb.append("[");
		sb.append("['','全部'],");
		int i = 1;
		for (ProDefinition proDefinition : list) {			
			if (proDefinition.getProType().getTypeName().equals(
							"测试备份")) {
				continue;
			}
			i++;
			sb.append("['").append(proDefinition.getDefId()).append("','")
					.append(proDefinition.getName()).append("']");
			sb.append(",");			
		}
		sb.deleteCharAt(sb.length()-1);//删除最后一个","字符
		sb.append("]");
		setJsonString(sb.toString());
		return SUCCESS;
	}	
	/**
	 * 用于收文报表统计
	 * @author F3222507 add at 2011-12-08
	 * @return
	 */
	public String comRecv() {
		QueryFilter filter = new QueryFilter(getRequest());
		filter.getPagingBean().setPageSize(99999);
		List<ProDefinition> list = proDefinitionService.getAll(filter);
		StringBuffer sb = new StringBuffer();
		sb.append("[");
		sb.append("['全部','全部'],");
		int i = 1;
		for (ProDefinition proDefinition : list) {			
			if (proDefinition.getProType().getTypeName().equals(
							"测试备份")) {
				continue;
			}
			i++;
			sb.append("['").append(proDefinition.getName()).append("','")
					.append(proDefinition.getName()).append("']");
			sb.append(",");			
		}
		sb.deleteCharAt(sb.length()-1);//删除最后一个","字符
		sb.append("]");
		setJsonString(sb.toString());
		return SUCCESS;
	}
	
	/**
	 * 
	 * combox调用
	 * 
	 * @return
	 */
	public String comQuick() {

		List list=new ArrayList();
		String typeId = getRequest().getParameter("typeId");
		//Map<Long, String> map= new HashMap<Long, String>();
		if(null!=typeId){
			list= proDefinitionService.getProDefinitionList(Long.valueOf(typeId));
		}else{
			list= proDefinitionService.getProDefinitionList(null);
		}
	    
		StringBuffer buff = new StringBuffer("[");
		/*for(int i = 0;i<list.size();i++){
			Object[] objs = (Object[])list.get(i);
			buff.append("[\"id\":\"" + objs[0].toString() + "\",");
			if(i<(list.size()-1))
				buff.append("\"name\":\"" + objs[1].toString()+"\"],");
			else 
				buff.append("\"name\":\"" + objs[1].toString()+"\"]]");
		}*/
		for(int i = 0;i<list.size();i++){
			Object[] objs = (Object[])list.get(i);
			buff.append("[\""+objs[0].toString() + "\",");
			if(i<(list.size()-1))
				buff.append("\""+objs[1].toString()+"\"],");
			else 
				buff.append("\""+objs[1].toString()+"\"]]");
		}
		jsonString = buff.toString();

		return SUCCESS;
	}

}
