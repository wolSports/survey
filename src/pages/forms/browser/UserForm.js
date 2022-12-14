import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context, url } from '../../../provider/Provider';
import style from './UserForm.module.scss';

const UserForm = () => {
  const [state, setState] = useState({
    email: '',
    fullName: '',
    birthday: '',
    gender: 0,
    district: 1,
    address: '',
    activity: [],
    practice: false,
    which: '',
    goal: [],
    personality: [],
    hasMaterial: false,
    whichMaterial: '',
    indications: '',
  });
  const [valid, setValid] = useState(false);
  const [error, setError] = useState('');

  const { genders, activities, goals, personalities, districts } = useContext(Context);
  const { email, fullName, birthday, gender, district, address, activity, practice, hasMaterial, whichMaterial,
    which, goal, personality, indications } = state;

  const navigate = useNavigate();

  useEffect(() => {
    setState((prevSt) => ({
      ...prevSt,
      gender: genders[0]?.id,
      district: districts[0]?.id,
    }))
  }, [])

  const handleChange = ({ target }) => {
    const { checked } = target;
    let { name, value } = target;
    if (name.includes('activity')) {
      value = checked ? [...activity, +value] : activity.filter((a) => a !== +value);
      name = 'activity';
    }
    if (name.includes('personality')) {
      value = checked ? [...personality, +value] : personality.filter((a) => a !== +value);
      name = 'personality';
    }
    if (name.includes('goal')) {
      value = checked ? [...goal, +value] : goal.filter((a) => a !== +value);
      name = 'goal';
    }
    if (name === 'gender' || name === 'district') value = +value;
    if (name === 'practice' || name === 'hasMaterial') value = checked;
    setState((prevSt) => ({
      ...prevSt,
      [name]: value,
    }));
  }

  useEffect(() => {
    const validEmail = !!email && /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/g.test(email);
    const validName = !!fullName;
    const validBirthday = !!birthday;
    const validGender = !!gender;
    const validAddress = !!address;
    const validActivity = activity.length > 0;
    const validWhich = (practice && !!which) || !practice;
    const validMaterial = (hasMaterial && !!whichMaterial) || !hasMaterial;
    const validGoal = goal.length > 0;
    const validPersonality = personality.length > 0;
    const isValid = validEmail && validName && validBirthday && validAddress
      && validActivity && validWhich && validGoal && validPersonality
      && validMaterial && validGender;
    setValid(isValid);
  }, [fullName, email, birthday, gender, address, activity, which, practice, goal, personality, hasMaterial, whichMaterial])

  const handleSubmit = async (e) => {
    e.preventDefault();
    const obj = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(state),
    };
    console.log({ state })
    const data = await fetch(`${url}/user`, obj);
    const error = await data.json();
    if (Object.keys(error).length !== 0) {
      setError(error.message)
      return;
    }
    navigate('/')
  }
  return (
    <form className={ style.form } onSubmit={ handleSubmit }>
      {error && <p className={ style.error }>{error}</p>}
      <input
        type="text"
        name="fullName"
        value={ fullName }
        onChange={ handleChange }
        placeholder="Nome completo"
        aria-label="Nome completo"
      />
      <input
        type="email"
        name="email"
        onChange={ handleChange }
        value={ email }
        placeholder="E-mail"
        aria-label="E-mail"
      />
      <legend>Data de nascimento</legend>
      <input
        type="date"
        id="birthday"
        name="birthday"
        onChange={ handleChange }
        value={ birthday }
      />
      <legend>Como voc?? se identifica? (G??nero)</legend>
      <section className={ style.gender }>
        <select name="gender" defaultValue="0" value={gender}>
          <option value="0">Selecione o que melhor se encaixa</option>
          {genders.map(({ id, name }) => (
            <option key={id} value={id}>{name}</option>
          ))}
        </select>
      </section>
      <select
        value={ district }
        name="district"
        aria-label="Regi??o administrativa"
        onChange={ handleChange }
      >
        {districts.map(({ id, name }) => (
          <option value={ id } key={ id }>{ name }</option>
        ))}
      </select>
      <input
        type="text"
        name="address"
        value={ address }
        onChange={ handleChange }
        placeholder="Qual a quadra?"
        aria-label="Qual a quadra?"
      />
      <div>
        <legend>Quais atividades f??sicas s??o do seu interesse?</legend>
        <p>Pode ser aquela atividade que voc?? sempre gostou, mas nunca mais fez, ou aquela que voc?? j?? fez a muito tempo e nunca mais praticou e nem sabe onde tem!</p>
      </div>
      <section className={ style.activities }>
        {activities.map(({ id, name }) => (
          <label htmlFor={ name } key={ id }>
            <input
              type="checkbox"
              name={ `activity-${id}` }
              id={ name }
              value={ id }
              onChange={ handleChange }
              checked={ activity.includes(id) }
            />
            {name}
          </label>
        ))}
      </section>
      <section className={ style.practice }>
        <section>
          <label>
            <input
              type="checkbox"
              name="practice"
              onChange={ handleChange }
              checked={ practice }
            />
            Voc?? pratica alguma das atividades marcadas acima?
          </label>
          <input
            type="text"
            name="which"
            onChange={ handleChange }
            value={ which }
            disabled={ !practice }
            placeholder="Quais?"
            aria-label="Quais?"
          />
        </section>
        <section>
          <label>
            <input
              type="checkbox"
              name="hasMaterial"
              onChange={ handleChange }
              checked={ hasMaterial }
            />
            Voc?? tem algum material guardado que poderia emprestar ou alugar?
          </label>
          <input
            type="text"
            name="whichMaterial"
            onChange={ handleChange }
            value={ whichMaterial }
            disabled={ !hasMaterial }
            placeholder="Quais?"
            aria-label="Quais?"
          />
        </section>
      </section>
      <legend>Hoje, qual seu objetivo quando voc?? procura fazer uma atividade f??sica?</legend>
      <section className={ style.goals }>
        {goals.map(({ id, name }) => (
          <label htmlFor={ name } key={ id }>
            <input
              type="checkbox"
              name={ `goal-${id}` }
              id={ name }
              value={ id }
              onChange={ handleChange }
              checked={ goal.includes(id) }
            />
            {name}
          </label>
        ))}
      </section>
      <legend>Quando voc?? vai fazer exerc??cio, voc?? se considera uma pessoa:</legend>
      <section className={ style.personalities }>
        {personalities.map(({ id, name }) => (
          <label htmlFor={name} key={ id }>
            <input
              type="checkbox"
              name={ `personality-${id}` }
              id={ name }
              value={ id }
              onChange={ handleChange }
              checked={ personality.includes(id) }
            />
            {name}
          </label>
        ))}
      </section>
      <label htmlFor="indications" className={ style.indications }>
        Voc?? conhece algum grupo ou um local que tem atividade f??sica (esporte, funcional, yoga, taichi, qualquer atividade ao ar livre) - Conta para gente onde fica e se tem algum respons??vel!
        <textarea
          name="indications"
          onChange={ handleChange }
          id="indications"
          value={ indications }
        />
      </label>
      <button
        type="submit"
        onSubmit={ handleSubmit }
        disabled={ !valid }
      >
        Enviar
      </button>
    </form>
  )
}

export default UserForm;
