package com.gdssoft.oa.action.hrm;

/*
 * 捷达世软件(深圳)有限公司 OA办公管理系统 
 */
import java.lang.reflect.Type;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.annotation.Resource;

import org.apache.commons.lang.StringUtils;

import com.gdssoft.oa.model.archive.Archives;
import com.gdssoft.oa.model.hrm.ContractEvent;
import com.gdssoft.oa.model.hrm.UserContract;
import com.gdssoft.oa.model.system.FileAttach;
import com.gdssoft.oa.service.hrm.ContractEventService;
import com.gdssoft.oa.service.hrm.UserContractService;
import com.gdssoft.oa.service.system.FileAttachService;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.util.BeanUtil;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.core.util.JsonUtil;
import com.gdssoft.core.web.action.BaseAction;


import flexjson.DateTransformer;
import flexjson.JSONSerializer;

/**
 * 
 * @author
 * 
 */
public class UserContractAction extends BaseAction {
	@Resource
	private UserContractService userContractService;
	@Resource
	private FileAttachService fileAttachService;
	@Resource
	private ContractEventService contractEventService;

	private UserContract userContract;
	private String data;
	private Long contractId;

	public Long getContractId() {
		return contractId;
	}

	public String getData() {
		return data;
	}

	public void setData(String data) {
		this.data = data;
	}

	public void setContractId(Long contractId) {
		this.contractId = contractId;
	}

	public UserContract getUserContract() {
		return userContract;
	}

	public void setUserContract(UserContract userContract) {
		this.userContract = userContract;
	}

	/**
	 * 显示列表
	 */
	public String list() {

		QueryFilter filter = new QueryFilter(getRequest());
		List<UserContract> list = userContractService.getAll(filter);

		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
				.append(filter.getPagingBean().getTotalItems()).append(
						",result:");

		JSONSerializer json = new JSONSerializer();
		json.exclude(new String[] { "*.class" }).transform(
				new DateTransformer("yyyy-MM-dd"),
				new String[] { "signDate", "startDate", "expireDate" });

		buff.append(json.exclude(new String[] { "class", "contractEvents" })
				.serialize(list));
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
				userContractService.remove(new Long(id));
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
		UserContract userContract = userContractService.get(contractId);
		// 将数据转成JSON格式
		StringBuffer sb = new StringBuffer("{success:true,data:");
		Gson gson=new GsonBuilder().excludeFieldsWithoutExposeAnnotation().setDateFormat("yyyy-MM-dd").create();
		sb.append(gson.toJson(userContract));
		sb.append("}");
		setJsonString(sb.toString());

		return SUCCESS;
	}

	/**
	 * 合同续约
	 * */
	public String Renew() {
		boolean pass = false;
		StringBuffer buff = new StringBuffer("{");
		String details = getRequest().getParameter("details");
		if (StringUtils.isNotEmpty(details)) {
			Gson gson = new Gson();
			ContractEvent[] contractEvents = gson.fromJson(details,
					ContractEvent[].class);
			if (contractEvents != null && contractEvents.length > 0) {
				for (ContractEvent contractEvent : contractEvents) {
					contractEvent.setCreateTime(new Date());
					contractEvent.setCreator(ContextUtil.getCurrentUser()
							.getFullname());
					contractEvent.setUserContract(userContract);
					userContract.getContractEvents().add(contractEvent);
				}
			}
		}
		if (userContract.getContractId() == null) {
			if (!(userContract.getStartDate().getTime() > userContract
					.getExpireDate().getTime())) {
				pass = true;
			} else {
				buff.append("msg:'合同生效日期早于满约日期,请重新输入！',");
			}
		}

		if (pass) {
			userContract.setSignDate(new Date());
			userContractService.save(userContract);
			buff.append("success:true}");
		} else {
			try {
				UserContract contract = userContractService.get(userContract
						.getContractId());
				BeanUtil.copyNotNullProperties(contract, userContract);
				userContractService.save(contract);
			} catch (Exception e) {
				logger.error(e.getMessage());
			}
			buff.append("failure:true}");
		}
		setJsonString(buff.toString());
		return SUCCESS;
	}

	/**
	 * 添加及保存操作
	 */
	public String save() {
		boolean pass = false;
		StringBuffer buff = new StringBuffer("{");
		String details = getRequest().getParameter("details");
		if (StringUtils.isNotEmpty(details)) {
			Gson gson = new Gson();
			ContractEvent[] contractEvents = gson.fromJson(details,
					ContractEvent[].class);
			if (contractEvents != null && contractEvents.length > 0) {
				for (ContractEvent contractEvent : contractEvents) {
					contractEvent.setCreateTime(new Date());
					contractEvent.setCreator(ContextUtil.getCurrentUser()
							.getFullname());
					contractEvent.setUserContract(userContract);
					userContract.getContractEvents().add(contractEvent);
				}
			}
		}

		if (userContract.getContractId() == null) {
			if (!(userContract.getStartDate().getTime() > userContract
					.getExpireDate().getTime())
					&& userContractService.checkContractNo(userContract
							.getContractNo())) {
				pass = true;
			} else {
				buff.append("msg:'合同编号已存在或生效日期早于满约日期,请重新输入',");
			}
		} else {
			pass = true;
		}

		if (pass) {
			String fileIds = getRequest().getParameter("fileIds");
			System.out.println(fileIds);
			// 合同附件
			if (StringUtils.isNotEmpty(fileIds)) {
				String[] fileId = fileIds.split(",");
				Set<FileAttach> contractAttachs = new HashSet<FileAttach>();
				for (String id : fileId) {
					if (!id.equals("")) {
						contractAttachs
								.add(fileAttachService.get(new Long(id)));
					}
				}
				userContract.setContractAttachs(contractAttachs);
			}
			userContractService.save(userContract);
			buff.append("success:true}");
		} else {
			try {
				UserContract contract = userContractService.get(userContract
						.getContractId());
				BeanUtil.copyNotNullProperties(contract, userContract);
				userContractService.save(contract);
			} catch (Exception e) {
				logger.error(e.getMessage());
			}
			buff.append("failure:true}");
		}
		setJsonString(buff.toString());
		return SUCCESS;
	}
}